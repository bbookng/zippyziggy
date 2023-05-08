package com.zippyziggy.search.dto.response.server;

import com.zippyziggy.search.dto.response.WriterResponse;
import com.zippyziggy.search.model.EsPrompt;
import lombok.Builder;
import lombok.Data;

@Data
public class ExtensionSearchPrompt {

    public static ExtensionSearchPrompt of(
            EsPrompt esPrompt,
            SearchFromPromptResponse fromPrompt,
            WriterResponse writer
    ) {

        return ExtensionSearchPrompt.builder()
                .promptUuid(esPrompt.getPromptUuid())
                .title(esPrompt.getTitle())
                .description(esPrompt.getDescription())
                .category(esPrompt.getCategory())
                .prefix(esPrompt.getPrefix())
                .suffix(esPrompt.getSuffix())
                .example(esPrompt.getExample())
                .originalPromptUuid(esPrompt.getOriginalPromptUuid())
                .regDt(esPrompt.getRegDt())
                .likeCnt(esPrompt.getLikeCnt().longValue())

                .updDt(fromPrompt.getUpdDt())
                .thumbnail(fromPrompt.getThumbnail())
                .talkCnt(fromPrompt.getTalkCnt().intValue())
                .commentCnt(fromPrompt.getCommentCnt().intValue())
                .isLiked(fromPrompt.getIsLiked())
                .isBookmarked(fromPrompt.getIsBookmarked())

                .writerResponse(writer)
                .build();
    }

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

    @Builder
    public ExtensionSearchPrompt(
        String promptUuid,
        String title,
        String description,
        String category,
        String prefix,
        String suffix,
        String example,
        String originalPromptUuid,

        String thumbnail,
        Integer hit,
        Long regDt,
        Long updDt,

        Integer talkCnt,
        Integer commentCnt,
        Long likeCnt,
        Boolean isLiked,
        Boolean isBookmarked,

        WriterResponse writerResponse
    ) {
        this.promptUuid = promptUuid;
        this.title = title;
        this.description = description;
        this.category = category;
        this.prefix = prefix;
        this.suffix = suffix;
        this.example = example;
        this.originalPromptUuid = originalPromptUuid;

        this.thumbnail = thumbnail;
        this.hit = hit;
        this.regDt = regDt;
        this.updDt = updDt;

        this.talkCnt = talkCnt;
        this.commentCnt = commentCnt;
        this.likeCnt = likeCnt;
        this.isLiked = isLiked;
        this.isBookmarked = isBookmarked;

        this.writerResponse = writerResponse;
    }

}
