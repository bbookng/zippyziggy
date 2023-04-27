package com.zippyziggy.search.controller;

import com.zippyziggy.search.dto.response.ExtensionSearchPromptList;
import com.zippyziggy.search.service.EsPromptService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/search")
public class EsPromptController {

    private final EsPromptService esPromptService;

    @GetMapping("/extension")
    public ResponseEntity<ExtensionSearchPromptList> searchInExtension(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            Pageable pageable
    ) {
        return ResponseEntity.ok(esPromptService.extensionSearch(keyword, category, pageable));
    }
}
