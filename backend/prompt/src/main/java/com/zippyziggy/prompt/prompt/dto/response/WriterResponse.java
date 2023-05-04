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
	private UUID writerUuid;
	private String writerImg;
	private String writerNickname;

	public static WriterResponse from (MemberResponse memberResponse) {
		return WriterResponse.builder()
				.writerUuid(memberResponse.getUserUuid())
				.writerImg(memberResponse.getProfileImg())
				.writerNickname(memberResponse.getNickname()).build();
	}
}
