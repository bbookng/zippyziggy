package com.zippyziggy.prompt.prompt.dto.response;

import java.time.Instant;
import java.time.ZoneId;
import org.springframework.lang.Nullable;
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
	private Instant regDt;
	private Instant updDt;

	private MessageResponse messageResponse;

	// writer, originer 추가 필요
	public static PromptDetailResponse from(Prompt prompt) {
		MessageResponse message = new MessageResponse(prompt.getPrefix(), prompt.getExample(), prompt.getSuffix());
		Instant regDt = prompt.getRegDt().atZone(ZoneId.systemDefault()).toInstant();
		Instant updDt = prompt.getRegDt().atZone(ZoneId.systemDefault()).toInstant();

		PromptDetailResponse response = PromptDetailResponse.builder()
			.messageResponse(message)
			.title(prompt.getTitle())
			.description(prompt.getDescription())
			.thumbnail(prompt.getThumbnail())
			.category(prompt.getCategory().toString())
			.likeCnt(prompt.getLikeCnt())
			.regDt(regDt)
			.updDt(updDt)
			.build();

		return response;
	}

}
