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
            .talkId(esTalk.getTalkId())
            .title(esTalk.getTitle())
            .regDt(esTalk.getRegDt())
            .commentCnt(commentCnt)
            .likeCnt(esTalk.getLikeCnt())
            .question(esTalk.getEsMessages().get(0).getContent())
            .answer(esTalk.getEsMessages().get(1).getContent())
            .hit(esTalk.getHit().intValue())
            .build();
    }

    private final WriterResponse writer;
    private final Long talkId;
    private final String title;
    private final Long regDt;
    private final Long likeCnt;
    private final Long commentCnt;
    private final Integer hit;
    private final String question;
    private final String answer;


    @Builder
    public SearchTalk(
            WriterResponse writer,
            Long talkId,
            String title,
            Integer hit,
            Long regDt,
            Long commentCnt,
            Long likeCnt,
            String question,
            String answer
    ) {
        this.writer = writer;
        this.talkId = talkId;
        this.title = title;
        this.hit = hit;
        this.regDt = regDt;
        this.commentCnt = commentCnt;
        this.likeCnt = likeCnt;
        this.question = question;
        this.answer = answer;
    }

}
