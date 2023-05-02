package com.zippyziggy.search.model;

import lombok.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class EsMessage {
	private String role;
	private String content;
}
