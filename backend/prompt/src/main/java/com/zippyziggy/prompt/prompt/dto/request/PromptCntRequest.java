package com.zippyziggy.prompt.prompt.dto.request;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PromptCntRequest {
    private String promptUuid;
    private Integer cnt;
}
