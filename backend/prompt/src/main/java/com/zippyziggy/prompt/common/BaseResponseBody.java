package com.zippyziggy.prompt.common;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class BaseResponseBody {
	String message = null;

	public static BaseResponseBody of(String message) {
		return new BaseResponseBody(message);
	}
}
