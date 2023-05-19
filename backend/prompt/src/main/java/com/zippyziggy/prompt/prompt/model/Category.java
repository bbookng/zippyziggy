package com.zippyziggy.prompt.prompt.model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;

@Getter
@ToString
@RequiredArgsConstructor
public enum Category {
	FUN("fun"), STUDY("study"), BUSINESS("business"), PROGRAMMING("programming"), ETC("etc");

	private final String description;
}
