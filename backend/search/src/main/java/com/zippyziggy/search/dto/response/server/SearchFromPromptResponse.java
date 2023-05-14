package com.zippyziggy.search.dto.response.server;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;

@Data
@Getter
@Builder
public class SearchFromPromptResponse {
    private String thumbnail;
    private Long updDt;
    private Long talkCnt;
    private Long commentCnt;
    private Boolean isLiked;
    private Boolean isBookmarked;

}
