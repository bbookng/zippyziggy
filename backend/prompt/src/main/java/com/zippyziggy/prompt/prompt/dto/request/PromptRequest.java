package com.zippyziggy.prompt.prompt.dto.request;

import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PromptRequest {

	@NotNull
	private String title;

	@NotNull
	private String content;

	@NotNull
	private String category;

	@NotNull
	private MessageRequest message;

}
