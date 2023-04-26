package com.zippyziggy.prompt.prompt.dto.response;

import java.time.ZoneId;

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

	private MemberResponse writer;
	private Long likeCnt;
	private Long commentCnt;
	private Long forkCnt;
	private Long talkCnt;

	private long regDt;
	private long updDt;

	private Boolean isBookmarked;
	private Boolean isLiked;

	public static ForkedPromptResponse from(MemberResponse writerInfo, Prompt prompt,
		Long commentCnt, Long forkCnt, Long talkCnt,
		Boolean isBookmarked, Boolean isLiked) {

		long regDt = prompt.getRegDt().atZone(ZoneId.systemDefault()).toInstant().getEpochSecond();
		long updDt = prompt.getRegDt().atZone(ZoneId.systemDefault()).toInstant().getEpochSecond();

		ForkedPromptResponse response = ForkedPromptResponse.builder()
			.thumbnail(prompt.getThumbnail())
			.title(prompt.getTitle())
			.description(prompt.getDescription())
			.writer(writerInfo)
			.likeCnt(prompt.getLikeCnt())
			.commentCnt(commentCnt)
			.forkCnt(forkCnt)
			.talkCnt(talkCnt)
			.regDt(regDt)
			.updDt(updDt)
			.isBookmarked(isBookmarked)
			.isLiked(isLiked)
			.build();

		return response;
	}


}
