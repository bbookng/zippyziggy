package com.zippyziggy.prompt.prompt.dto.response;

import java.util.UUID;

import com.zippyziggy.prompt.prompt.model.Prompt;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;

@Data
@Getter
@Builder
public class PromptResponse {

	private UUID promptUuid;
	private String title;
	private String description;
	private String thumbnail;
	private String category;
	private MessageResponse message;

	public static PromptResponse from(Prompt prompt) {
		MessageResponse message = new MessageResponse(prompt.getPrefix(), prompt.getExample(),
			prompt.getSuffix());

		PromptResponse response = PromptResponse.builder()
			.promptUuid(prompt.getPromptUuid())
			.title(prompt.getTitle())
			.description(prompt.getDescription())
			.thumbnail(prompt.getThumbnail())
			.category(prompt.getCategory().toString())
			.message(message)
			.build();

		return response;
	}

}
