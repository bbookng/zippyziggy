package com.zippyziggy.prompt.prompt.dto.response;

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

	private Long commentId;
	private CommentWriter member;
	private long regDt;
	private long updDt;
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

		long regDt = comment.getRegDt().atZone(ZoneId.systemDefault()).toInstant().getEpochSecond();
		long updDt = comment.getRegDt().atZone(ZoneId.systemDefault()).toInstant().getEpochSecond();

		PromptCommentResponse response = PromptCommentResponse.builder()
			.commentId(comment.getId())
			.regDt(regDt)
			.updDt(updDt)
			.content(comment.getContent())
			.build();

		return response;
	}

}
