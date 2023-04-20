package com.zippyziggy.prompt.prompt.dto.response;

import java.time.Instant;
import java.time.ZoneId;
import java.util.List;

import com.zippyziggy.prompt.prompt.model.Prompt;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter @Setter
@Builder
public class ForkedPromptResponse {

	private String thumbnail;
	private String title;
	private String description;

	// member 연결되면 추가
	private String writerNickname;
	private String writerImg;

	private Long likeCnt;
	private Long commentCnt;
	private Long forkCnt;
	private Long talkCnt;
	private List<String> forkMemberImg;

	private Instant regDt;
	private Instant updDt;

	// member 연결되면 추가
	private Boolean isBookmarked;

	public static ForkedPromptResponse from(Prompt prompt) {

		Instant regDt = prompt.getRegDt().atZone(ZoneId.systemDefault()).toInstant();
		Instant updDt = prompt.getRegDt().atZone(ZoneId.systemDefault()).toInstant();

		ForkedPromptResponse response = ForkedPromptResponse.builder()
			.thumbnail(prompt.getThumbnail())
			.title(prompt.getTitle())
			.description(prompt.getDescription())
			.likeCnt(prompt.getLikeCnt())
			.regDt(regDt)
			.updDt(updDt)
			.build();

		return response;
	}


}
