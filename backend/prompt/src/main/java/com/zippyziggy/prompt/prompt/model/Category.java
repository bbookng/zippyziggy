package com.zippyziggy.prompt.prompt.model;

import com.zippyziggy.prompt.common.TypeModel;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;

@Getter
@ToString
@RequiredArgsConstructor
public enum Category implements TypeModel {
	FUN("fun"), STUDY("study"), BUSINESS("business"), PROGRAMMING("programming"), ETC("etc");

	private final String description;

	@Override
	public String getKey() {
		return name();
	}

}
