package com.zippyziggy.prompt.prompt.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PromptRequest {

	private String title;
	private String content;
	private String category;
	private MessageRequest message;

}
