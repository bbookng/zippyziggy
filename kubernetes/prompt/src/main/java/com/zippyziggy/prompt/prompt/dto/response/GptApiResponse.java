package com.zippyziggy.prompt.prompt.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GptApiResponse {
	private String apiResult;

	public static GptApiResponse from(String data) {
		return new GptApiResponse(data);
	}
}
