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
	private String model;

}
