package com.zippyziggy.prompt.prompt.model;

import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
public enum Languages {
	KOREAN("korean"), ENGLISH("english");

	private final String language;

	Languages(String language) {
		this.language = language;
	}

	public String getLanguage() {
		return language;
	}
}
