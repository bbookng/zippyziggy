package com.zippyziggy.prompt.talk.dto.request;

import com.zippyziggy.prompt.talk.model.Role;

import lombok.Data;

@Data
public class MessageRequest {

	private Role role;
	private String content;
}
