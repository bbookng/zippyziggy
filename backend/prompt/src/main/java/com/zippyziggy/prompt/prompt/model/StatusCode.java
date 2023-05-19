package com.zippyziggy.prompt.prompt.model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;

@Getter
@ToString
@RequiredArgsConstructor
public enum StatusCode {
	DELETED("deleted"), OPEN("open");

	private final String description;
}
