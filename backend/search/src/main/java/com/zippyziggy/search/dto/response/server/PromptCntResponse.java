package com.zippyziggy.search.dto.response.server;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class PromptCntResponse {
    private final String promptUuid;
    private final Integer cnt;
}
