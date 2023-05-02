package com.zippyziggy.search.controller;

import com.zippyziggy.search.dto.response.ExtensionSearchPromptList;
import com.zippyziggy.search.dto.response.SearchPromptList;
import com.zippyziggy.search.service.EsPromptService;
import com.zippyziggy.search.service.EsTalkService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.SortDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/search")
public class SearchController {

    private final EsPromptService esPromptService;
    private final EsTalkService esTalkService;

    @Operation(summary = "프롬프트 검색", description = "프롬프트를 검색한다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "성공"),
        @ApiResponse(responseCode = "400", description = "잘못된 요청"),
        @ApiResponse(responseCode = "500", description = "서버 에러")
    })
    @GetMapping("/prompts")
    public ResponseEntity<SearchPromptList> searchPrompts(
        @RequestHeader(required = false) String crntMemberUuid,
        @RequestParam(required = false) String keyword,
        @RequestParam(required = false) String category,
        @PageableDefault(sort = "likeCnt",  direction = Sort.Direction.DESC) Pageable pageable,
        @SortDefault(direction = Sort.Direction.DESC) Sort sort
    ) {
        return ResponseEntity.ok(esPromptService.searchPrompts(
            crntMemberUuid, keyword, category, pageable, sort));
    }

    @Operation(summary = "[확장] 프롬프트 검색", description = "확장 프로그램에서 프롬프트를 검색한다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "성공"),
        @ApiResponse(responseCode = "400", description = "잘못된 요청"),
        @ApiResponse(responseCode = "500", description = "서버 에러")
    })
    @GetMapping("/extension")
    public ResponseEntity<ExtensionSearchPromptList> searchInExtension(
        @RequestHeader(required = false) String crntMemberUuid,
        @RequestParam(required = false) String keyword,
        @RequestParam(required = false) String category,
        @PageableDefault(sort = "likeCnt",  direction = Sort.Direction.DESC) Pageable pageable,
        @SortDefault(direction = Sort.Direction.DESC) Sort sort
    ) {
        return ResponseEntity.ok(esPromptService.extensionSearch(crntMemberUuid, keyword, category, pageable, sort));
    }

//    @Operation(summary = "톡 검색", description = "톡을 검색한다.")
//    @ApiResponses({
//        @ApiResponse(responseCode = "200", description = "성공"),
//        @ApiResponse(responseCode = "400", description = "잘못된 요청"),
//        @ApiResponse(responseCode = "500", description = "서버 에러")
//    })
//    @GetMapping("/talks")
//    public ResponseEntity<SearchTalkList> searchTalks(
//        @RequestHeader(required = false) String crntMemberUuid,
//        @RequestParam(required = false) String keyword,
//        @RequestParam(required = false) String category,
//        @PageableDefault(sort = "likeCnt",  direction = Sort.Direction.DESC) Pageable pageable
//    ) {
//        return ResponseEntity.ok(esTalkService.searchTalks(
//            crntMemberUuid, keyword, category, pageable
//        ));
//    }

}
