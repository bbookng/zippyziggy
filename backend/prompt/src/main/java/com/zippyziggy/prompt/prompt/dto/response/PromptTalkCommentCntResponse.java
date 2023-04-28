package com.zippyziggy.prompt.prompt.dto.response;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;

@Data
@Getter
@Builder
public class PromptTalkCommentCntResponse {
    private Long talkCnt;
    private Long commentCnt;

    public static PromptTalkCommentCntResponse from(Long talkCnt, Long commentCnt) {
        return PromptTalkCommentCntResponse.builder()
                .talkCnt(talkCnt)
                .commentCnt(commentCnt).build();
    }
}
