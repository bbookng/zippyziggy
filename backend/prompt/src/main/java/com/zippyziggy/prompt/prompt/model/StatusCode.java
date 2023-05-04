package com.zippyziggy.prompt.prompt.model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;

@Getter
@ToString
@RequiredArgsConstructor
public enum StatusCode {
	OPEN("open"), DELETED("deleted");

	private final String description;
}
