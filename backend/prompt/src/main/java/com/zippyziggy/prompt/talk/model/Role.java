package com.zippyziggy.prompt.talk.model;

import java.lang.reflect.Type;

import com.zippyziggy.prompt.common.TypeModel;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;

@Getter @ToString
@RequiredArgsConstructor
public enum Role implements TypeModel {
	ASSISTANT("assistant"),    // gpt
	USER("user");

	private final String description;

	@Override
	public String getKey() {
		return name();
	}
}
