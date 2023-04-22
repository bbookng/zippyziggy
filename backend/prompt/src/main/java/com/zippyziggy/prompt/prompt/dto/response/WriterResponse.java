package com.zippyziggy.prompt.prompt.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;

import java.util.UUID;

@Data
@Getter
@AllArgsConstructor
public class WriterResponse {
	private UUID writerUuid;
	private String writerImg;
	private String writerNickname;
}
