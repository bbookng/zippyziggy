package com.zippyziggy.prompt.talk.dto.response;

import com.zippyziggy.prompt.prompt.dto.response.WriterResponse;

import com.zippyziggy.prompt.talk.model.Talk;
import java.time.ZoneId;
import lombok.Builder;
import lombok.Data;

@Data
public class MemberTalk {
    public static MemberTalk of(
        WriterResponse writer,
        Talk talk,
        Long commentCnt
    ) {
        return MemberTalk.builder()
            .writer(writer)
            .talkId(talk.getId())
            .title(talk.getTitle())
            .regDt(talk.getRegDt().atZone(ZoneId.systemDefault()).toInstant().getEpochSecond())
            .commentCnt(commentCnt)
            .likeCnt(talk.getLikeCnt())
            .question(talk.getMessages().get(0).getContent())
            .answer(talk.getMessages().get(1).getContent())
            .build();
    }

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
