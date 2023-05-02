package com.zippyziggy.search.dto.response.server;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class PromptCntResponse {
    @JsonProperty("promptUuid")
    private final String promptUuid;
    @JsonProperty("cnt")
    private final Integer cnt;
}
