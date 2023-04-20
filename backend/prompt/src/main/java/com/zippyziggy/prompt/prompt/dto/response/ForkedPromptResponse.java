package com.zippyziggy.prompt.prompt.dto.response;

import lombok.Data;
import lombok.Getter;

@Data
@Getter
public class ForkedPromptResponse {
	private String title;
	private String nickname;
	private Long likeCnt;
}
