package com.zippyziggy.prompt.talk.dto.request;

import java.util.List;

import com.zippyziggy.prompt.prompt.dto.request.PromptMessageRequest;

import lombok.Data;

@Data
public class TalkRequest {

	private String title;
	private List<MessageRequest> messages;

}
