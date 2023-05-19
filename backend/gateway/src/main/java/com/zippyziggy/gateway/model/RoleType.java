package com.zippyziggy.gateway.model;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public enum RoleType {
	USER("USER"), ADMIN("ADMIN");

	private final String role;

	RoleType(String role) {
		this.role = role;
	}

	public String getRole() {
		return role;
	}
}
