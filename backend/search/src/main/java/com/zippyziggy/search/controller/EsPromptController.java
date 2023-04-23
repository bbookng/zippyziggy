package com.zippyziggy.search.controller;

import co.elastic.clients.elasticsearch.core.search.Hit;
import com.zippyziggy.search.model.EsPrompt;
import com.zippyziggy.search.service.EsPromptService;
import java.io.IOException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.mapping.IndexCoordinates;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/search")
public class EsPromptController {

    private final EsPromptService esPromptService;

//    @GetMapping("/test/{id}")
//    public EsPrompt findById(@PathVariable("id") String id) {
//        EsPrompt esPrompt = elasticsearchOperations.get(id, EsPrompt.class,
//            IndexCoordinates.of("test"));
//        return esPrompt;
//    }

    // GetMapping 쿼리 검색
    @GetMapping("/test/query")
    public List<EsPrompt> findByQuery() {
        return esPromptService.testSearch();
    }
}
