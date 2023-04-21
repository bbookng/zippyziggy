package com.zippyziggy.prompt.prompt.dto.response;

import java.util.UUID;

import com.zippyziggy.prompt.prompt.model.Prompt;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;

@Data
@Getter
@Builder
public class ForkPromptResponse {

	private String title;
	private String description;
	private String thumbnail;
	private String category;
	private MessageResponse message;
	private UUID originalUuid;
	private UUID promptUuid;

	public static ForkPromptResponse from(Prompt prompt) {
		MessageResponse message = new MessageResponse(prompt.getPrefix(), prompt.getExample(),
			prompt.getSuffix());

		ForkPromptResponse response = ForkPromptResponse.builder()
			.title(prompt.getTitle())
			.description(prompt.getDescription())
			.thumbnail(prompt.getThumbnail())
			.category(prompt.getCategory().toString())
			.message(message)
			.originalUuid(prompt.getOriginPromptUuid())
			.promptUuid(prompt.getPromptUuid())
			.build();

		return response;
	}
}
