package com.zippyziggy.search.dto.response;

import com.zippyziggy.search.model.EsPrompt;
import lombok.Builder;
import lombok.Data;

@Data
public class ExtensionSearchPromptDto {
    public static ExtensionSearchPromptDto of (EsPrompt esPrompt) {
        return ExtensionSearchPromptDto.builder()
                .promptUuid(esPrompt.getPromptUuid())
                .title(esPrompt.getTitle())
                .description(esPrompt.getDescription())
                .hit(esPrompt.getHit())
                .likeCnt(esPrompt.getLikeCnt())
                .regDt(esPrompt.getRegDt())
                .updDt(esPrompt.getUpdDt())
                .category(esPrompt.getCategory())
                .prefix(esPrompt.getPrefix())
                .suffix(esPrompt.getSuffix())
                .example(esPrompt.getExample())
                .originalPromptUuid(esPrompt.getOriginalPromptUuid())
                .build();
    }

    private final String promptUuid;
    private final String title;
    private final String description;
    private final Integer hit;
    private final Integer likeCnt;
    private final String regDt;
    private final String updDt;
    private final String category;
    private final String prefix;
    private final String suffix;
    private final String example;
    private final String originalPromptUuid;

    @Builder
    public ExtensionSearchPromptDto(
            String promptUuid,
            String title,
            String description,
            Integer hit,
            Integer likeCnt,
            String regDt,
            String updDt,
            String category,
            String prefix,
            String suffix,
            String example,
            String originalPromptUuid
    ) {
        this.promptUuid = promptUuid;
        this.title = title;
        this.description = description;
        this.hit = hit;
        this.likeCnt = likeCnt;
        this.regDt = regDt;
        this.updDt = updDt;
        this.category = category;
        this.prefix = prefix;
        this.suffix = suffix;
        this.example = example;
        this.originalPromptUuid = originalPromptUuid;
    }

}
