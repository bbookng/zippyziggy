package com.zippyziggy.prompt.talk.dto.response;

import lombok.Data;

@Data
public class TalkListResponse {

	String question;
	String answer;
	String memberImg;
	String memberNickname;
	Long likeCnt;
	Long commentCnt;

}
