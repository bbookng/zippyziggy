package com.zippyziggy.prompt.prompt.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;

import java.util.UUID;

@Data
@Getter
@Builder
@AllArgsConstructor
public class WriterResponse {
	private String writerUuid;
	private String writerImg;
	private String writerNickname;
}
