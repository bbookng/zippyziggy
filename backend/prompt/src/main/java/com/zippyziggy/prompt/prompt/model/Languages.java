package com.zippyziggy.prompt.prompt.model;

import com.zippyziggy.prompt.common.TypeModel;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;

@ToString
@Getter
@RequiredArgsConstructor
public enum Languages implements TypeModel {
	KOREAN("korean"), ENGLISH("english");

	private final String description;

	@Override
	public String getKey() {
		return name();
	}

}
