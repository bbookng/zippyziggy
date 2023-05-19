package com.zippyziggy.prompt.talk.dto.response;

import java.util.List;

import javax.validation.constraints.NotNull;

import com.zippyziggy.prompt.prompt.dto.response.WriterResponse;
import org.springframework.lang.Nullable;

import com.zippyziggy.prompt.prompt.dto.response.MemberResponse;
import com.zippyziggy.prompt.prompt.dto.response.PromptCardResponse;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TalkDetailResponse {

	private String title;

	@Nullable
	private MemberResponse originMember;

	@NotNull
	private WriterResponse writer;

	private Boolean isLiked;
	private Long likeCnt;

	private long regDt;
	private long updDt;

	private List<MessageResponse> messages;

	@NotNull
	private PromptCardResponse originPrompt;

	@Nullable
	private List<TalkListResponse> talkList;

	private String model;

}
