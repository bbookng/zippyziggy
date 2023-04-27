package com.zippyziggy.search.service;

import com.zippyziggy.search.dto.response.ExtensionSearchPromptList;
import com.zippyziggy.search.model.EsPrompt;
import com.zippyziggy.search.repository.EsPromptRepository;

import java.util.ArrayList;
import java.util.List;

import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Service
public class EsPromptService {

    private final EsPromptRepository esPromptRepository;

    public ExtensionSearchPromptList extensionSearch(
        String keyword,
        String category,
        Pageable pageable
    ) {
        List<EsPrompt> esPrompts = new ArrayList<>();
        Long totalPromptsCnt = 0L;
        Integer totalPageCnt = 0;

        if (null != keyword & null != category) {

            Page<EsPrompt> pagedEsPrompt = esPromptRepository
                .findByKeywordAndCategory(keyword, category, pageable);

            esPrompts = pagedEsPrompt.stream().collect(Collectors.toList());
            totalPromptsCnt = pagedEsPrompt.getTotalElements();
            totalPageCnt = pagedEsPrompt.getTotalPages();

        } else if (null == keyword & null != category) {

            Page<EsPrompt> pagedEsPrompt = esPromptRepository
                .findByCategory(category, pageable);

            esPrompts = pagedEsPrompt.stream().collect(Collectors.toList());
            totalPromptsCnt = pagedEsPrompt.getTotalElements();
            totalPageCnt = pagedEsPrompt.getTotalPages();

        } else if (null != keyword & null == category) {

            Page<EsPrompt> pagedEsPrompt = esPromptRepository
                .findByKeywordOnly(keyword, pageable);

            esPrompts = pagedEsPrompt.stream().collect(Collectors.toList());
            totalPromptsCnt = pagedEsPrompt.getTotalElements();
            totalPageCnt = pagedEsPrompt.getTotalPages();

        } else if (null == keyword & null == category) {
            Page<EsPrompt> pagedEsPrompt = esPromptRepository
                .findAll(pageable);

            esPrompts = pagedEsPrompt.stream().collect(Collectors.toList());
            totalPromptsCnt = pagedEsPrompt.getTotalElements();
            totalPageCnt = pagedEsPrompt.getTotalPages();

        }

        return ExtensionSearchPromptList.of(totalPromptsCnt, totalPageCnt, esPrompts);

    }


}
