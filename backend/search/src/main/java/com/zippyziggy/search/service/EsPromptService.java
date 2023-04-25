package com.zippyziggy.search.service;

import com.zippyziggy.search.dto.response.ExtensionSearchPromptList;
import com.zippyziggy.search.model.EsPrompt;
import com.zippyziggy.search.repository.EsPromptRepository;

import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Service
public class EsPromptService {

    private final EsPromptRepository esPromptRepository;

    public ExtensionSearchPromptList search(
            String keyword
//            String category,
//            String sort
    ) {
        List<EsPrompt> esPrompts = new ArrayList<>();
        if (null != keyword) {
            esPrompts = esPromptRepository.findByTitleContainsOrDescriptionContainsOrPrefixContainsOrSuffixContainsOrExampleContains(
                    keyword, keyword, keyword, keyword, keyword
            );
        }
        else {
            esPromptRepository.findAll()
                    .forEach(esPrompts::add);
        }
        return ExtensionSearchPromptList.of(esPrompts);

    }


}
