package com.zippyziggy.search.client;

import com.zippyziggy.search.dto.response.server.CntResponse;
import com.zippyziggy.search.dto.response.server.PromptDetailResponse;
import com.zippyziggy.search.dto.response.server.PromptComment;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "prompt")
public interface PromptClient {
    @GetMapping("/prompts/{promptUuid}")
    Optional<PromptDetailResponse> getPromptDetail(
        @PathVariable UUID promptUuid,
        @RequestHeader String crntMemberUuid
    );

    @GetMapping("/prompts/{promptUuid}/comments")
    List<PromptComment> getPromptComments(@PathVariable UUID promptUuid);

    @GetMapping("/prompts/{promptUuid}/talks")
    List<PromptDetailResponse> getTalks(
        @PathVariable UUID promptUuid,
        @RequestHeader String crntMemberUuid
    );

    @GetMapping("/prompts/{promptUuid}/cnt")
    CntResponse getCntOfPrompt( @PathVariable UUID promptUuid );

    @GetMapping("/talks/{talkId}/commentCnt")
    Long getTalkCommentCnt( @PathVariable Long talkId );

}