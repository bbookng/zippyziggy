package com.zippyziggy.prompt.talk.model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;

@Getter @ToString
@RequiredArgsConstructor
public enum Role {
	ASSISTANT("assistant"),    // gpt
	USER("user");

	private final String description;

}
