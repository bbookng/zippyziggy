package com.zippyziggy.search.dto.response.server;

import lombok.Data;

@Data
public class PromptCntResponse {
    private final String promptUuid;
    private final Integer cnt;
}
