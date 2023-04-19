package com.zippyziggy.search.controller;

import com.zippyziggy.search.service.EsPromptService;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.elasticsearch.action.search.SearchResponse;
import org.springframework.http.ResponseEntity;
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

    @GetMapping("/test/{keyword}")
    public ResponseEntity<SearchResponse> search(@PathVariable String keyword) throws IOException {
        final SearchResponse res = esPromptService.searchInTestIndex();
        return ResponseEntity.ok(res);
    }
}
