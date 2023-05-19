package com.zippyziggy.search.dto.response.server;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MessageResponse {
	private String role;
	private String content;
}
