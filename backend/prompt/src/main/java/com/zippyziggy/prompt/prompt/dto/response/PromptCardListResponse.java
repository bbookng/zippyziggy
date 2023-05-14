package com.zippyziggy.prompt.prompt.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class PromptCardListResponse {

    private final Long totalPromptsCnt;
    private final Integer totalPageCnt;
    private final List<PromptCardResponse> promptCardResponseList;


    public static PromptCardListResponse from(
            Long totalPromptsCnt,
            Integer totalPageCnt,
            List<PromptCardResponse> promptCardResponseList
    ) {
        return new PromptCardListResponse(totalPromptsCnt, totalPageCnt, promptCardResponseList);
    }

}
