package com.zippyziggy.search.dto.response;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PromptTalkListResponse {

	private int talkCnt;
	private List<TalkListResponse> talks;

}
