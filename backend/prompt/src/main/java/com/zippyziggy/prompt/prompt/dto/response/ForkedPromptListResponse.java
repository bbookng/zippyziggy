package com.zippyziggy.prompt.prompt.dto.response;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;

import com.zippyziggy.prompt.prompt.model.Prompt;

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
	private List<ForkedPromptResponse> forkedPromptResponseList;

	public static ForkedPromptListResponse from(Page<Prompt> forkedPrompts) {
		List<ForkedPromptResponse> promptList = forkedPrompts.stream()
				.map(ForkedPromptResponse::from)
				.collect(Collectors.toList());

		long forkCnt = promptList.size();

		return new ForkedPromptListResponse((int)forkCnt, promptList);
	}


}
