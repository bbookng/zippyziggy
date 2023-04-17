package com.zippyziggy.member.model;

public enum RoleType {
	USER("user"), ADMIN("admin");

	private final String role;

	RoleType(String role) {
		this.role = role;
	}

	public String getRole() {
		return role;
	}
}
