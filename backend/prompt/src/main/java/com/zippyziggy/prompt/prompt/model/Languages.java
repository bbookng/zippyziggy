package com.zippyziggy.prompt.prompt.model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;

@Getter
@ToString
@RequiredArgsConstructor
public enum Languages {
	KOREAN("korean"), ENGLISH("english");

	private final String description;
}
