package com.zippyziggy.prompt.prompt.dto.response;

import com.zippyziggy.prompt.prompt.model.Prompt;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;

import java.time.ZoneId;
import java.util.UUID;

@Data
@Getter
@AllArgsConstructor
@Builder
public class PromptBookmarkResponse {

    private final String promptUuid;
    private final String title;
    private final String description;
    private final String category;
    private final String prefix;
    private final String suffix;
    private final String example;
    private final String originalPromptUuid;

    private final String thumbnail;
    private final Integer hit;
    private final Long regDt;
    private final Long updDt;

    private final Integer talkCnt;
    private final Integer commentCnt;
    private final Long likeCnt;
    private final Boolean isLiked;
    private final Boolean isBookmarked;

    private final WriterResponse writerResponse;

    public static PromptBookmarkResponse from(MemberResponse writerInfo, Prompt prompt,
                                              Long commentCnt, Long forkCnt, Long talkCnt,
                                              Boolean isBookmarked, Boolean isLiked) {

        WriterResponse writer = writerInfo.toWriterResponse();
        long regDt = prompt.getRegDt().atZone(ZoneId.systemDefault()).toInstant().getEpochSecond();
        long updDt = prompt.getRegDt().atZone(ZoneId.systemDefault()).toInstant().getEpochSecond();

        String originPrompt = null;

        UUID originPromptUuid = prompt.getOriginPromptUuid();
        if (originPromptUuid == null) {
            originPrompt = "";
        } else {
            originPrompt = originPromptUuid.toString();
        }

        return PromptBookmarkResponse.builder()
                .promptUuid(prompt.getPromptUuid().toString())
                .title(prompt.getTitle())
                .description(prompt.getDescription())
                .category(prompt.getCategory().getDescription().toUpperCase())
                .prefix(prompt.getPrefix())
                .suffix(prompt.getSuffix())
                .example(prompt.getExample())
                .originalPromptUuid(originPrompt)
                .thumbnail(prompt.getThumbnail())
                .hit(prompt.getHit())
                .regDt(regDt)
                .updDt(updDt)
                .talkCnt(talkCnt.intValue())
                .commentCnt(commentCnt.intValue())
                .likeCnt(prompt.getLikeCnt())
                .isLiked(isLiked)
                .isBookmarked(isBookmarked)
                .writerResponse(writer)
                .build();

    }

}
