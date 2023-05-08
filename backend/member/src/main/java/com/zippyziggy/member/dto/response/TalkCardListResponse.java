package com.zippyziggy.member.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class TalkCardListResponse {

	private int talkCnt;
	private List<TalkCardResponse> talks;

}
