package com.zippyziggy.prompt.prompt.dto.response;

import lombok.Builder;
import lombok.Data;
import lombok.Setter;

import java.util.List;

@Data
@Builder
public class RecentPromptCardListResponse {

    private final List<PromptCardResponse> promptCardResponseList;


}
