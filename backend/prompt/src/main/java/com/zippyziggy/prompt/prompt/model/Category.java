package com.zippyziggy.prompt.prompt.model;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public enum Category {
	FUN("fun"), STUDY("study"), BUSINESS("business"), PROGRAMMING("programming"), ETC("etc");

	private final String category;

	Category(String category) {
		this.category = category;
	}

	public String getCategory() {
		return category;
	}

}
