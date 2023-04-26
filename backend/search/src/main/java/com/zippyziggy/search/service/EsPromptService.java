package com.zippyziggy.search.service;

import com.zippyziggy.search.dto.response.ExtensionSearchPromptList;
import com.zippyziggy.search.model.EsPrompt;
import com.zippyziggy.search.repository.EsPromptRepository;

import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
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

    public ExtensionSearchPromptList search(
        String keyword,
        String category,
        String sort,
        Pageable pageable
    ) {
        final String sortType = (null != sort) ? sort : "LIKE";

        Page<EsPrompt> esPrompts;

        if (null != keyword & null != category) {

        } else if (null == keyword & null != category) {
            esPrompts = esPromptRepository
                .findByCategory(category, pageable);
        } else if (null != keyword & null == category) {
            esPrompts = esPromptRepository
                .findByTitleContainsOrDescriptionContainsOrPrefixContainsOrSuffixContainsOrExampleContains(
                    keyword, keyword, keyword, keyword, keyword, pageable);
        } else if (null == keyword & null == category) {
            esPrompts = esPromptRepository
                .findAll(pageable);
        }
        return ExtensionSearchPromptList.of(esPrompts);

    }


}
