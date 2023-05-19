package com.zippyziggy.prompt.prompt.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class NoticeRequest {

	private String memberUuid;
	private String content;
	private String urlValue;

	public NoticeRequest from(NoticeRequest noticeRequest) {
		return new NoticeRequest(this.memberUuid, this.content, this.urlValue);
	}
}
