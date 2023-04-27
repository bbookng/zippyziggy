package com.zippyziggy.search.dto.response;

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
public class Prompt {

	private Writer writerResponse;

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

}
