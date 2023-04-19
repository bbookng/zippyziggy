package com.zippyziggy.prompt.prompt.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;

@Data
@Getter
@AllArgsConstructor
public class WriterResponse {
	private String writerId;
	private String writerImg;
	private String writerNickname;
}
