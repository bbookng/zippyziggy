package com.zippyziggy.prompt.prompt.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PromptMessageRequest {

	private String prefix;
	private String example;
	private String suffix;

}
