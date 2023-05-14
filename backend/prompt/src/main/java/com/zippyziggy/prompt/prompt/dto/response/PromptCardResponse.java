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
public class PromptCardResponse {

	private String promptUuid;
	private String thumbnail;
	private String title;
	private String description;

	private WriterResponse writer;
	private Long likeCnt;
	private Long commentCnt;
	private Long forkCnt;
	private Long talkCnt;
	private long hit;

	private long regDt;
	private long updDt;

	private Boolean isBookmarked;
	private Boolean isLiked;

	public static PromptCardResponse from(MemberResponse writerInfo, Prompt prompt,
										  Long commentCnt, Long forkCnt, Long talkCnt,
										  Boolean isBookmarked, Boolean isLiked) {

		WriterResponse writer = writerInfo.toWriterResponse();
		long regDt = prompt.getRegDt().atZone(ZoneId.systemDefault()).toInstant().getEpochSecond();
		long updDt = prompt.getRegDt().atZone(ZoneId.systemDefault()).toInstant().getEpochSecond();

		PromptCardResponse response = PromptCardResponse.builder()
				.promptUuid(prompt.getPromptUuid().toString())
				.thumbnail(prompt.getThumbnail())
				.title(prompt.getTitle())
				.description(prompt.getDescription())
				.writer(writer)
				.likeCnt(prompt.getLikeCnt())
				.commentCnt(commentCnt)
				.forkCnt(forkCnt)
				.talkCnt(talkCnt)
				.regDt(regDt)
				.updDt(updDt)
				.isBookmarked(isBookmarked)
				.isLiked(isLiked)
				.hit(prompt.getHit())
				.build();

		return response;
	}


}
