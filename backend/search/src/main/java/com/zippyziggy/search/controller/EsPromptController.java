package com.zippyziggy.search.controller;

import com.zippyziggy.search.dto.request.InsertEsPrompt;
import com.zippyziggy.search.dto.response.ExtensionSearchPromptList;
import com.zippyziggy.search.dto.response.SearchPromptList;
import com.zippyziggy.search.model.EsPrompt;
import com.zippyziggy.search.service.EsPromptService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/search")
public class EsPromptController {

    private final EsPromptService esPromptService;

    @Operation(summary = "프롬프트 검색", description = "프롬프트를 검색한다. params를 비우면 전체 목록 조회가 가능하다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "500", description = "서버 에러")
    })
    @GetMapping("/prompts")
    public ResponseEntity<SearchPromptList> searchPrompts(
            @Nullable @RequestHeader String crntMemberUuid,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            Pageable pageable
    ) {
        return ResponseEntity.ok(esPromptService.searchPrompts(
                UUID.fromString(crntMemberUuid), keyword, category, pageable));
    }

    @Operation(summary = "[확장] 프롬프트 검색", description = "확장 프로그램에서 프롬프트를 검색한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "500", description = "서버 에러")
    })
    @GetMapping("/extension")
    public ResponseEntity<ExtensionSearchPromptList> searchInExtension(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            Pageable pageable
    ) {
        return ResponseEntity.ok(esPromptService.extensionSearch(keyword, category, pageable));
    }

    @GetMapping("/insert-test")
    public ResponseEntity<Void> insertDoc(
            @RequestBody InsertEsPrompt insertEsPrompt
    ) {
        new EsPrompt(insertEsPrompt);
        esPromptService.saveDocument();
    }
}
