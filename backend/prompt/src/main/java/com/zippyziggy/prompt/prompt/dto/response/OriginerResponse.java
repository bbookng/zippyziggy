package com.zippyziggy.prompt.prompt.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;

import java.util.UUID;

@Data
@Getter
@AllArgsConstructor
public class OriginerResponse {
	private UUID originerUuid;
	private String originerImg;
	private String originerNickname;
}
