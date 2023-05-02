package com.zippyziggy.prompt.prompt.dto.request;

import lombok.Data;

@Data
public class PromptCntRequest {
    private final String promptUuid;
    private final Integer cnt;
}
