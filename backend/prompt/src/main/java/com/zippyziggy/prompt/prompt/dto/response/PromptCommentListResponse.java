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

}
