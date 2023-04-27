package com.zippyziggy.prompt.talk.dto.request;

import java.util.List;

import lombok.Data;
import org.springframework.lang.Nullable;

@Data
public class TalkRequest {

	@Nullable
	private String promptUuid;
	private String title;
	private List<MessageRequest> messages;

}
