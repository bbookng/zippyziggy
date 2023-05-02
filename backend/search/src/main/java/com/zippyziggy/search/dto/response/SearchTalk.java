package com.zippyziggy.search.dto.response;

import com.zippyziggy.search.model.EsPrompt;
import lombok.Builder;
import lombok.Data;

@Data
public class SearchTalk {

    public static SearchTalk of(
            EsPrompt esPrompt,
            PromptDetailResponse promptDetailResponse,
            Integer talkCnt,
            Integer commentCnt,
            Long likeCnt,
            Boolean isLiked,
            Boolean isBookmarked,
            WriterResponse writerResponse
    ) {

        return SearchTalk.builder()
                .promptUuid(esPrompt.getPromptUuid())
                .title(esPrompt.getTitle())
                .regDt(promptDetailResponse.getRegDt())
                .commentCnt(commentCnt)
                .likeCnt(likeCnt)
                .build();
    }

    private final String promptUuid;

    private final MemberResponse memberResponse;

    private final String title;
    private final Long regDt;
    private final Long likeCnt;
    private final Integer commentCnt;
    private final Integer hit;


    @Builder
    public SearchTalk(
            String promptUuid,
            String title,
            Integer hit,
            Long regDt,
            Integer commentCnt,
            Long likeCnt,

        MemberResponse memberResponse) {
        this.promptUuid = promptUuid;
        this.title = title;
        this.hit = hit;
        this.regDt = regDt;
        this.commentCnt = commentCnt;
        this.likeCnt = likeCnt;

        this.memberResponse = memberResponse;
    }

}
