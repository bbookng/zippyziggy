package com.zippyziggy.search.service;

import com.zippyziggy.search.client.MemberClient;
import com.zippyziggy.search.client.PromptClient;
import com.zippyziggy.search.dto.response.ExtensionSearchPromptList;
import com.zippyziggy.search.dto.response.SearchPrompt;
import com.zippyziggy.search.dto.response.SearchPromptList;
import com.zippyziggy.search.dto.response.WriterResponse;
import com.zippyziggy.search.dto.response.server.ExtensionSearchPrompt;
import com.zippyziggy.search.dto.response.server.MemberResponse;
import com.zippyziggy.search.dto.response.server.SearchFromPromptResponse;
import com.zippyziggy.search.dto.response.server.SyncEsPrompt;
import com.zippyziggy.search.exception.EsPromptNotFoundException;
import com.zippyziggy.search.exception.MemberNotFoundException;
import com.zippyziggy.search.model.EsPrompt;
import com.zippyziggy.search.repository.EsPromptRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.client.circuitbreaker.CircuitBreaker;
import org.springframework.cloud.client.circuitbreaker.CircuitBreakerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
        String crntMemberUuid,
        String keyword,
        String category,
        Integer page,
        Integer size,
        String sort
    ) {
        final Sort sortBy = Sort.by(Sort.Direction.DESC, sort);
        final Pageable pageable = PageRequest.of(page, size, sortBy);

        CircuitBreaker circuitBreaker = circuitBreakerFactory.create("circuitBreaker");

        final Page<EsPrompt> pagedEsPrompt = search(keyword, category, pageable);
        final long totalPromptsCnt = pagedEsPrompt.getTotalElements();
        final int totalPageCnt = pagedEsPrompt.getTotalPages();

        final List<SearchPrompt> searchPrompts = new ArrayList<>();
        for (EsPrompt esPrompt : pagedEsPrompt) {
            // prompt 서버에서 필요한 정보 조회
            final UUID promptUuid = UUID.fromString(esPrompt.getPromptUuid());
            final SearchFromPromptResponse fromPrompt = circuitBreaker
                .run(() -> promptClient.searchFromPrompt(promptUuid, crntMemberUuid));

            // 사용자 조회
            final MemberResponse member = circuitBreaker
                .run(() -> memberClient
                    .getMemberInfo(UUID.fromString(esPrompt.getUserId()))
                    .orElseThrow(MemberNotFoundException::new));
            final WriterResponse writer = member.toWriterResponse();

            // dto로 변환하기
            searchPrompts.add(SearchPrompt.of(
                esPrompt,
                fromPrompt,
                writer
            ));

        }
        return SearchPromptList.of(totalPromptsCnt, totalPageCnt, searchPrompts);
    }

    public ExtensionSearchPromptList extensionSearch(
        String crntMemberUuid,
        String keyword,
        String category,
        Integer page,
        Integer size,
        String sort
    ) {
        final Sort sortBy = Sort.by(Sort.Direction.DESC, sort);
        final Pageable pageable = PageRequest.of(page, size, sortBy);

        CircuitBreaker circuitBreaker = circuitBreakerFactory.create("circuitBreaker");

        final Page<EsPrompt> pagedEsPrompt = search(keyword, category, pageable);
        final long totalPromptsCnt = pagedEsPrompt.getTotalElements();
        final int totalPageCnt = pagedEsPrompt.getTotalPages();

        final List<ExtensionSearchPrompt> searchPrompts = new ArrayList<>();
        for (EsPrompt esPrompt : pagedEsPrompt) {
            // prompt 서버에서 필요한 정보 조회
            final UUID promptUuid = UUID.fromString(esPrompt.getPromptUuid());
            final SearchFromPromptResponse fromPrompt = circuitBreaker
                .run(() -> promptClient.searchFromPrompt(promptUuid, crntMemberUuid));

            // 사용자 조회
            final MemberResponse member = circuitBreaker
                .run(() -> memberClient
                    .getMemberInfo(UUID.fromString(esPrompt.getUserId()))
                    .orElseThrow(MemberNotFoundException::new));
            final WriterResponse writer = member.toWriterResponse();

            // dto로 변환하기
            searchPrompts.add(ExtensionSearchPrompt.of(
                esPrompt,
                fromPrompt,
                writer));

        }
        return ExtensionSearchPromptList.of(totalPromptsCnt, totalPageCnt, searchPrompts);
    }

    public void insertDocument(SyncEsPrompt syncEsPrompt) {
        log.info(String.valueOf(syncEsPrompt));
        final EsPrompt esPrompt = EsPrompt.of(syncEsPrompt);
        esPromptRepository.save(esPrompt);
    }

    public void updateDocument(String promptUuid, SyncEsPrompt syncEsPrompt) {
        final EsPrompt oldEsPrompt = esPromptRepository
            .findEsPromptByPromptUuid(promptUuid)
            .orElseThrow(EsPromptNotFoundException::new);
        esPromptRepository.delete(oldEsPrompt);
        final EsPrompt newEsPrompt = EsPrompt.of(syncEsPrompt);
        esPromptRepository.save(newEsPrompt);
    }

    public void deleteDocument(String promptUuid) {
        final EsPrompt esPrompt = esPromptRepository
            .findEsPromptByPromptUuid(promptUuid)
            .orElseThrow(EsPromptNotFoundException::new);
        esPromptRepository.delete(esPrompt);
    }

    public void updateHit(String promptUuid, Long hit) {
        final EsPrompt esPrompt = esPromptRepository
            .findEsPromptByPromptUuid(promptUuid)
            .orElseThrow(EsPromptNotFoundException::new);
        esPrompt.setHit(hit.intValue());
        esPromptRepository.save(esPrompt);
    }

    public void updateLikeCnt(String promptUuid, Long likeCnt) {
        final EsPrompt esPrompt = esPromptRepository
                .findEsPromptByPromptUuid(promptUuid)
                .orElseThrow(EsPromptNotFoundException::new);
        esPrompt.setLikeCnt(likeCnt.intValue());
        esPromptRepository.save(esPrompt);
    }

    private Page<EsPrompt> search(
        String keyword,
        String category,
        Pageable pageable
    ) {
        Page<EsPrompt> pagedEsPrompt = null;
        keyword = (keyword.equals("")) ? null : keyword;
        category = (category.equals("ALL")) ? null : category;

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
