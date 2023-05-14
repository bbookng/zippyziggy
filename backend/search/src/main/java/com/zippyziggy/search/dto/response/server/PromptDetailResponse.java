package com.zippyziggy.search.dto.response.server;

import com.zippyziggy.search.dto.response.OriginerResponse;
import com.zippyziggy.search.dto.response.PromptMessageResponse;
import com.zippyziggy.search.dto.response.WriterResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.lang.Nullable;

@Data
@Getter @Setter
@AllArgsConstructor
@Builder
public class PromptDetailResponse {

	private WriterResponse writer;

	@Nullable
	private OriginerResponse originer;

	private String title;
	private String description;
	private String thumbnail;
	private Long likeCnt;
	private Boolean isLiked;
	private Boolean isBookmarked;
	private Boolean isForked;
	private String category;
	private long regDt;
	private long updDt;

	private PromptMessageResponse messageResponse;

}
