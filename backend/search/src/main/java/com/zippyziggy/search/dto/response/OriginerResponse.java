package com.zippyziggy.search.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;

@Data
@Getter
@AllArgsConstructor
public class OriginerResponse {
	private String originerUuid;
	private String originerImg;
	private String originerNickname;
}
