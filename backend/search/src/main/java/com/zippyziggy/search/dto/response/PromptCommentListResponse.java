package com.zippyziggy.search.dto.response;

import java.util.List;
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
