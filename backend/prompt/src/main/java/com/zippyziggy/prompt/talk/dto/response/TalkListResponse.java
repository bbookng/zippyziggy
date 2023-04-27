package com.zippyziggy.prompt.talk.dto.response;

import lombok.Data;

@Data
public class TalkListResponse {

	private String question;
	private String answer;
	private String memberImg;
	private String memberNickname;
	private Long likeCnt;
	private Long commentCnt;
}
