package com.zippyziggy.prompt.prompt.dto.response;

import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.DeleteMapping;

import com.zippyziggy.prompt.prompt.model.Prompt;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter @Setter
@AllArgsConstructor
@Builder
public class PromptDetailResponse {

	private WriterResponse writerResponse;

	@Nullable
	private OriginerResponse originerResponse;

	private String title;
	private String description;
	private String thumbnail;
	private Long likeCnt;
	private Boolean isLiked;
	private Boolean isBookmarked;
	private String category;

	private MessageResponse messageResponse;

	// writer, originer 추가 필요
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
