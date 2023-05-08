package com.zippyziggy.member.client;


import com.zippyziggy.member.dto.response.MemberTalkList;
import com.zippyziggy.member.dto.response.PromptCardListResponse;
import com.zippyziggy.member.dto.response.PromptCardResponse;
import com.zippyziggy.member.dto.response.TalkCardListResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name="prompt")
public interface PromptClient {
    @GetMapping("/prompts/members/like/{crntMemberUuid}")
    PromptCardListResponse getPromptsLike(@PathVariable("crntMemberUuid") String crntMemberUuid,
                                            @RequestParam("page") Integer page,
                                            @RequestParam("size") Integer size);

    @GetMapping("/prompts/members/bookmark/{crntMemberUuid}")
    PromptCardListResponse getPromptsBookmark(@PathVariable("crntMemberUuid") String crntMemberUuid,
                                              @RequestParam("page") Integer page,
                                              @RequestParam("size") Integer size);


    @GetMapping("/prompts/members/profile/{crntMemberUuid}")
    PromptCardListResponse getPrompts(@PathVariable("crntMemberUuid") String crntMemberUuid,
                                                @RequestParam("page") Integer page,
                                                @RequestParam("size") Integer size);

    @GetMapping("/prompts/members/recent/prompts/{crntMemberUuid}")
    List<PromptCardResponse> getRecentPrompts(@PathVariable("crntMemberUuid") String crntMemberUuid);

    @GetMapping("/talks/members/profile/{crntMemberUuid}")
    MemberTalkList getTalks(
            @PathVariable("crntMemberUuid") String crntMemberUuid,
            Pageable pageable);
}