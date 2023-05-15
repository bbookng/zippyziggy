package com.zippyziggy.prompt.prompt.dto.response;

import com.zippyziggy.prompt.prompt.model.Prompt;
import java.time.ZoneId;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;

@Data
@Getter
@Builder
public class SearchPromptResponse {
    private String thumbnail;
    private Long updDt;
    private Long talkCnt;
    private Long commentCnt;
    private Boolean isLiked;
    private Boolean isBookmarked;

    public static SearchPromptResponse from(
        Prompt prompt,
        Long talkCnt,
        Long commentCnt,
        Boolean isLiked,
        Boolean isBookmarked
    ) {
        return SearchPromptResponse.builder()
                .thumbnail(prompt.getThumbnail())
                .updDt(prompt.getUpdDt().atZone(ZoneId.systemDefault()).toInstant().getEpochSecond())
                .talkCnt(talkCnt)
                .commentCnt(commentCnt)
                .isLiked(isLiked)
                .isBookmarked(isBookmarked)
                .build();
    }
}
