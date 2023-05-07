package com.zippyziggy.member.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TalkCardResponse {

	private Long talkId;
	private String title;
	private String question;
	private String answer;
	private WriterResponse writer;
	private Long likeCnt;
	private Long commentCnt;
	private Boolean isLiked;

	public static TalkCardResponse from(
			Long talkId,
			String title,
			String question,
			String answer,
			WriterResponse writer,
			Long likeCnt,
			Long commentCnt,
			Boolean isLiked
	) {
		return TalkCardResponse.builder()
				.talkId(talkId)
				.title(title)
				.question(question)
				.answer(answer)
				.writer(writer)
				.likeCnt(likeCnt)
				.commentCnt(commentCnt)
				.isLiked(isLiked)
				.build();
	}
}
