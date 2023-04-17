package com.zippyziggy.prompt.talk.model;

public enum Role {
	ASSISTANT("assistant"),    // gpt
	USER("user");

	private final String role;

	Role(String role) {
		this.role = role;
	}

	public String getRole() {
		return role;
	}
}
