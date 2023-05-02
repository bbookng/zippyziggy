package com.zippyziggy.search.service;

import com.zippyziggy.search.client.PromptClient;
import com.zippyziggy.search.model.EsTalk;
import com.zippyziggy.search.repository.EsTalkRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.client.circuitbreaker.CircuitBreakerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Service
public class EsTalkService {

    private final EsTalkRepository esTalkRepository;
    private final CircuitBreakerFactory circuitBreakerFactory;
    private final PromptClient promptClient;

//    public SearchTalkList searchTalks(
//        String crntMemberUuid,
//        String keyword,
//        String category,
//        Pageable pageable
//    ) {
//        CircuitBreaker circuitBreaker = circuitBreakerFactory.create("circuitBreaker");
//
//        final Page<EsTalk> pagedEsTalk = search(keyword, category, pageable);
//        final long totalTalksCnt = pagedEsTalk.getTotalElements();
//        final int totalPageCnt = pagedEsTalk.getTotalPages();
//
//        final List<SearchTalk> searchTalks = new ArrayList<>();
//        for (EsTalk esTalk : pagedEsTalk) {
//            final Long talkId = esTalk.getTalkId();
//
//            // MemberClient에 memberUuid로 요청
//
//
//            // PromptClient에 commentCnt 요청
//
//            searchTalks.add(SearchTalk.of(esTalk));
//        }
//
//
//    }
//
//    private Page<EsTalk> search(
//        String keyword,
//        String category,
//        Pageable pageable
//    ) {
//        Page<EsTalk> pagedEsTalk = null;
//        keyword = (keyword.equals("")) ? null : keyword;
//        category = (category.equals("ALL")) ? null : category;
//
//        if (null != keyword & null != category) {
//            pagedEsTalk = esTalkRepository
//                .findByKeywordAndCategory(keyword, category, pageable);
//
//        } else if (null == keyword & null != category) {
//            pagedEsTalk = esTalkRepository
//                .findByCategory(category, pageable);
//
//        } else if (null != keyword & null == category) {
//            pagedEsTalk = esTalkRepository
//                .findByKeywordOnly(keyword, pageable);
//
//        } else if (null == keyword & null == category) {
//            pagedEsTalk = esTalkRepository
//                .findAll(pageable);
//        }
//
//        return pagedEsTalk;
//    }

}
