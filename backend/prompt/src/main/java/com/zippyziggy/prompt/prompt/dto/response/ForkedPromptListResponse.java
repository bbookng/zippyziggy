package com.zippyziggy.prompt.prompt.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Data
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ForkedPromptListResponse {

	private Integer forkCnt;
	private List<PromptCardResponse> forkedPromptResponseList;

}
