package com.zippyziggy.prompt.talk.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TalkListResponse {

	private Long talkId;
	private String title;
	private String question;
	private String answer;
	private String memberImg;
	private String memberNickname;
	private Long likeCnt;
	private Long commentCnt;
	private Boolean isLiked;

	public static TalkListResponse from(
		Long talkId,
		String title,
		String question,
		String answer,
		String memberImg,
		String memberNickname,
		Long likeCnt,
		Long commentCnt,
		Boolean isLiked
	) {
		return TalkListResponse.builder()
				.talkId(talkId)
				.title(title)
				.question(question)
				.answer(answer)
				.memberImg(memberImg)
				.memberNickname(memberNickname)
				.likeCnt(likeCnt)
				.commentCnt(commentCnt)
				.isLiked(isLiked)
				.build();
	}
}
