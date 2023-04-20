package com.zippyziggy.prompt.prompt.dto.response;

import java.time.Instant;
import java.time.ZoneId;

import com.zippyziggy.prompt.prompt.model.PromptComment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter
@Builder
public class PromptCommentResponse {

	private CommentWriter member;
	private Instant regDt;
	private Instant updDt;
	private String content;


	@Builder
	@Getter @Setter
	@AllArgsConstructor
	@NoArgsConstructor
	public static class CommentWriter {
		private String memberNickname;
		private String memberImg;
	}

	// member 관련 추가 필요
	public static PromptCommentResponse from(PromptComment comment) {

		Instant regDt = comment.getRegDt().atZone(ZoneId.systemDefault()).toInstant();
		Instant updDt = comment.getRegDt().atZone(ZoneId.systemDefault()).toInstant();

		PromptCommentResponse response = PromptCommentResponse.builder()
			.regDt(regDt)
			.updDt(updDt)
			.content(comment.getContent())
			.build();

		return response;
	}

}
