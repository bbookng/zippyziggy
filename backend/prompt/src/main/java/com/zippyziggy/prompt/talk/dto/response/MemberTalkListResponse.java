package com.zippyziggy.prompt.talk.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class MemberTalkListResponse {

	private int talkCnt;
	private List<TalkListResponse> talks;

}
