package com.zippyziggy.search.service;

import com.zippyziggy.search.dto.response.ExtensionSearchPromptList;
import com.zippyziggy.search.model.EsPrompt;
import com.zippyziggy.search.repository.EsPromptRepository;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.function.Function;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
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

        Page<EsPrompt> esPrompts = new Page<EsPrompt>() {
            @Override
            public int getTotalPages() {
                return 0;
            }

            @Override
            public long getTotalElements() {
                return 0;
            }

            @Override
            public <U> Page<U> map(Function<? super EsPrompt, ? extends U> converter) {
                return null;
            }

            @Override
            public int getNumber() {
                return 0;
            }

            @Override
            public int getSize() {
                return 0;
            }

            @Override
            public int getNumberOfElements() {
                return 0;
            }

            @Override
            public List<EsPrompt> getContent() {
                return null;
            }

            @Override
            public boolean hasContent() {
                return false;
            }

            @Override
            public Sort getSort() {
                return null;
            }

            @Override
            public boolean isFirst() {
                return false;
            }

            @Override
            public boolean isLast() {
                return false;
            }

            @Override
            public boolean hasNext() {
                return false;
            }

            @Override
            public boolean hasPrevious() {
                return false;
            }

            @Override
            public Pageable nextPageable() {
                return null;
            }

            @Override
            public Pageable previousPageable() {
                return null;
            }

            @NotNull
            @Override
            public Iterator<EsPrompt> iterator() {
                return null;
            }
        };

        if (null != keyword & null != category) {
            esPrompts = esPromptRepository
                       .findByKeywordAndCategory(keyword, pageable);
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
