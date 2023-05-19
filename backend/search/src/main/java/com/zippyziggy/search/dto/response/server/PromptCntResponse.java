package com.zippyziggy.search.dto.response.server;

import lombok.Data;

@Data
public class PromptCntResponse {
    private String promptUuid;
    private Long cnt;
}
