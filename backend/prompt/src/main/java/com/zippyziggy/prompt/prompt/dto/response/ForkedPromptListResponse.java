package com.zippyziggy.prompt.prompt.dto.response;

import java.util.List;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;

@Data
@Getter
@Builder
public class ForkedPromptListResponse {

	private Integer forkCnt;
	private List<ForkedPromptResponse> forkedPromptResponseList;

}
