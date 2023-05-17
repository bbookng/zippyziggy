package com.zippyziggy.member.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class PromptCardListResponse {

    private final Long totalPromptsCnt;
    private final Integer totalPageCnt;
    private final List<PromptCardResponse> promptCardResponseList;

}
