package com.zippyziggy.prompt.prompt.dto.response;

import com.zippyziggy.prompt.prompt.model.Prompt;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;

@Data
@Getter
@AllArgsConstructor
@Builder
public class PromptDetailResponse {

	private WriterResponse writerResponse;
	private OriginerResponse originerResponse;

	private String title;
	private String description;
	private String thumbnail;
	private Long likeCnt;
	private Boolean isLiked;
	private Boolean isBookmarked;
	private String category;

	private MessageResponse messageResponse;

	public static PromptDetailResponse from(Prompt prompt) {
		MessageResponse message = new MessageResponse(prompt.getPrefix(), prompt.getExample(), prompt.getSuffix());

		PromptDetailResponse response = PromptDetailResponse.builder()
			.messageResponse(message)
			.title(prompt.getTitle())
			.description(prompt.getDescription())
			.thumbnail(prompt.getThumbnail())
			.category(prompt.getCategory().toString())
			.likeCnt(prompt.getLikeCnt())
			.build();

		return response;
	}

}
