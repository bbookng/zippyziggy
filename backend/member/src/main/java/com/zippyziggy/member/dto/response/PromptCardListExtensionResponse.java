package com.zippyziggy.member.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class PromptCardListExtensionResponse {

    private final Long totalPromptsCnt;
    private final Integer totalPageCnt;
    private final List<PromptBookmarkResponse> promptCardResponseList;

    public static PromptCardListExtensionResponse from(
            Long totalPromptsCnt,
            Integer totalPageCnt,
            List<PromptBookmarkResponse> promptCardResponseList
    ) {
        return new PromptCardListExtensionResponse(totalPromptsCnt, totalPageCnt, promptCardResponseList);
    }

}
