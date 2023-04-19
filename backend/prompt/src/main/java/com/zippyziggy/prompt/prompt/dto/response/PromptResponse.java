package com.zippyziggy.prompt.prompt.dto.response;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;

@Data
@Getter
@Builder
public class PromptResponse {

	private String title;
	private String content;
	private String thumbnail;
	private String category;
	private MessageResponse message;

}
