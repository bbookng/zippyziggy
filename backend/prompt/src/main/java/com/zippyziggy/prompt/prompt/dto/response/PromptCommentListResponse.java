package com.zippyziggy.prompt.prompt.dto.response;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;

import com.zippyziggy.prompt.prompt.model.PromptComment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;

@Data
@Getter
@AllArgsConstructor
public class PromptCommentListResponse {

	private Long commentCnt;
	private List<PromptCommentResponse> comments;

	public static PromptCommentListResponse from(Page<PromptComment> comments) {

		List<PromptCommentResponse> commentList = comments.stream()
			.map(PromptCommentResponse::from)
			.collect(Collectors.toList());

		long commentCnt = commentList.size();

		return new PromptCommentListResponse(commentCnt, commentList);
	}
}
