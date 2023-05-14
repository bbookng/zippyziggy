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

}
