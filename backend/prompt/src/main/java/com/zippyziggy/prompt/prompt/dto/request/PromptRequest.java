package com.zippyziggy.prompt.prompt.dto.request;

import javax.validation.constraints.NotNull;

import com.zippyziggy.prompt.prompt.model.Category;
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
	private String description;

	@NotNull
	private Category category;

	@NotNull
	private PromptMessageRequest message;

}
