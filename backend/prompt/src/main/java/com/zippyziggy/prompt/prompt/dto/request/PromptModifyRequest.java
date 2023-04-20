package com.zippyziggy.prompt.prompt.dto.request;

import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PromptModifyRequest {

	@NotNull
	private String title;

	@NotNull
	private String description;

	@NotNull
	private String category;

}
