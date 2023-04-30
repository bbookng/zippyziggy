package com.zippyziggy.prompt.talk.dto.response;

import com.zippyziggy.prompt.prompt.dto.response.MemberResponse;
import com.zippyziggy.prompt.talk.model.TalkComment;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;

import java.time.ZoneId;

@Data
@Getter
@Builder
public class TalkCommentResponse {

    private Long commentId;
    private MemberResponse member;
    private long regDt;
    private long updDt;
    private String content;

    public static TalkCommentResponse from(TalkComment comment, MemberResponse member) {

        long regDt = comment.getRegDt().atZone(ZoneId.systemDefault()).toInstant().getEpochSecond();
        long updDt = comment.getRegDt().atZone(ZoneId.systemDefault()).toInstant().getEpochSecond();

        return TalkCommentResponse.builder()
                .commentId(comment.getId())
                .member(member)
                .regDt(regDt)
                .updDt(updDt)
                .content(comment.getContent())
                .build();
    }

}
