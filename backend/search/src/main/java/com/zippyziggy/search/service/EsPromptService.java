package com.zippyziggy.search.service;

import com.zippyziggy.exception.PromptNotFoundException;
import com.zippyziggy.search.client.MemberClient;
import com.zippyziggy.search.client.PromptClient;
import com.zippyziggy.search.dto.response.*;
import com.zippyziggy.search.model.EsPrompt;
import com.zippyziggy.search.repository.EsPromptRepository;

import java.util.ArrayList;
import java.util.List;

import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.client.circuitbreaker.CircuitBreaker;
import org.springframework.cloud.client.circuitbreaker.CircuitBreakerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Service
public class EsPromptService {

    private final EsPromptRepository esPromptRepository;

    private final CircuitBreakerFactory circuitBreakerFactory;
    private final PromptClient promptClient;
    private final MemberClient memberClient;

    public SearchPromptList searchPrompts(
        @Nullable UUID crntMemberUuid,
        String keyword,
        String category,
        Pageable pageable
    ) {
        CircuitBreaker circuitBreaker = circuitBreakerFactory.create("circuitBreaker");

        final Page<EsPrompt> pagedEsPrompt = search(keyword, category, pageable);
        final long totalPromptsCnt = pagedEsPrompt.getTotalElements();
        final int totalPageCnt = pagedEsPrompt.getTotalPages();

        final List<SearchPrompt> searchPrompts = new ArrayList<>();
        for (EsPrompt esPrompt : pagedEsPrompt) {
            // prompt 조회
            final UUID promptUuid = UUID.fromString(esPrompt.getPromptUuid());
            final Prompt prompt = circuitBreaker
                    .run(() -> promptClient
                            .getPromptDetail(promptUuid)
                            .orElseThrow(PromptNotFoundException::new));

            // 사용자 조회
            //TODO server to server api 만든 후 Member application에서 호출하는 방식으로 변경해야함
            Writer writer = prompt.getWriterResponse();

            // 톡 목록 조회 후 size
            //TODO server to server api 만든 후 dto에서 바로 호출
            final Integer talkCnt = circuitBreaker
                    .run(() -> promptClient
                            .getTalks(promptUuid)
                            .size());

            // 댓글 목록 조회 후 size
            //TODO server to server api 만든 후 dto에서 바로 호출
            final Integer commentCnt = circuitBreaker
                    .run(() -> promptClient
                            .getPromptComments(promptUuid)
                            .size());

            // dto로 변환하기
            searchPrompts.add(SearchPrompt.of(
                            esPrompt,
                            prompt,
                            talkCnt,
                            commentCnt,
                            prompt.getLikeCnt(),
                            prompt.getIsLiked(),
                            prompt.getIsBookmarked(),
                            writer));

        }
        return SearchPromptList.of(totalPromptsCnt, totalPageCnt, searchPrompts);
    }

    public ExtensionSearchPromptList extensionSearch(
        String keyword,
        String category,
        Pageable pageable
    ) {
        final Page<EsPrompt> pagedEsPrompt = search(keyword, category, pageable);

        final List<EsPrompt> esPrompts = pagedEsPrompt.stream().collect(Collectors.toList());
        final long totalPromptsCnt = pagedEsPrompt.getTotalElements();
        final int totalPageCnt = pagedEsPrompt.getTotalPages();

        return ExtensionSearchPromptList.of(totalPromptsCnt, totalPageCnt, esPrompts);

    }

    private Page<EsPrompt> search (
        String keyword,
        String category,
        Pageable pageable
    ) {
            Page<EsPrompt> pagedEsPrompt = null;

            if (null != keyword & null != category) {
                pagedEsPrompt = esPromptRepository
                    .findByKeywordAndCategory(keyword, category, pageable);

            } else if (null == keyword & null != category) {
                pagedEsPrompt = esPromptRepository
                    .findByCategory(category, pageable);

            } else if (null != keyword & null == category) {
                pagedEsPrompt = esPromptRepository
                    .findByKeywordOnly(keyword, pageable);

            } else if (null == keyword & null == category) {
                pagedEsPrompt = esPromptRepository
                    .findAll(pageable);
            }

            return pagedEsPrompt;
    }
}
