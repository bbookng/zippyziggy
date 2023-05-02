package com.zippyziggy.search.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
public class SearchTalk {

//    public static SearchTalk of(
//        TalkDetailResponse talkDetailResponse
//    ) {
//        return SearchTalk.builder()
//            .memberResponse()
//            .title(esTalk.getTitle())
//            .regDt(esTalk.getRegDt())
//            .commentCnt()
//            .likeCnt(esTalk.getLikeCnt())
//            .build();
//    }

    private final MemberResponse memberResponse;

    private final String title;
    private final Long regDt;
    private final Long likeCnt;
    private final Integer commentCnt;
    private final Integer hit;


    @Builder
    public SearchTalk(
            MemberResponse memberResponse,

            String title,
            Integer hit,
            Long regDt,
            Integer commentCnt,
            Long likeCnt
    ) {
        this.memberResponse = memberResponse;

        this.title = title;
        this.hit = hit;
        this.regDt = regDt;
        this.commentCnt = commentCnt;
        this.likeCnt = likeCnt;
    }

}
