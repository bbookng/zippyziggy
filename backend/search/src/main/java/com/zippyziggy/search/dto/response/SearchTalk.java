package com.zippyziggy.search.dto.response;

import com.zippyziggy.search.model.EsTalk;
import lombok.Builder;
import lombok.Data;

@Data
public class SearchTalk {

    public static SearchTalk of(
        WriterResponse writer,
        EsTalk esTalk,
        Long commentCnt
    ) {
        return SearchTalk.builder()
            .writer(writer)
            .title(esTalk.getTitle())
            .regDt(esTalk.getRegDt())
            .commentCnt(commentCnt)
            .likeCnt(esTalk.getLikeCnt())
            .build();
    }

    private final WriterResponse writer;

    private final String title;
    private final Long regDt;
    private final Long likeCnt;
    private final Long commentCnt;
    private final Integer hit;


    @Builder
    public SearchTalk(
            WriterResponse writer,

            String title,
            Integer hit,
            Long regDt,
            Long commentCnt,
            Long likeCnt
    ) {
        this.writer = writer;

        this.title = title;
        this.hit = hit;
        this.regDt = regDt;
        this.commentCnt = commentCnt;
        this.likeCnt = likeCnt;
    }

}
