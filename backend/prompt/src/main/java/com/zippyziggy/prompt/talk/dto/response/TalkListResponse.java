package com.zippyziggy.prompt.talk.dto.response;

import com.zippyziggy.prompt.talk.model.Talk;
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


	public TalkListResponse from(Talk talk) {
		return TalkListResponse.builder()
				.build();

	}
}
