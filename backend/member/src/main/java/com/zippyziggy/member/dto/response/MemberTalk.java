package com.zippyziggy.member.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
public class MemberTalk {

    private WriterResponse writer;
    private Long talkId;
    private String title;
    private Long regDt;
    private Long likeCnt;
    private Long commentCnt;
    private Integer hit;
    private String question;
    private String answer;

    @Builder
    public MemberTalk(
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
