package com.zippyziggy.search.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TalkListResponse {

	private String question;
	private String answer;
	private String memberImg;
	private String memberNickname;
	private Long likeCnt;
	private Long commentCnt;
	private Boolean isLiked;


	public static TalkListResponse from(String question, String answer,
								 String memberImg, String memberNickname,
								 Long likeCnt, Long commentCnt, Boolean isLiked) {
		return TalkListResponse.builder()
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
