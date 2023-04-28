package com.zippyziggy.prompt.prompt.dto.request;

import com.zippyziggy.prompt.prompt.model.Prompt;
import lombok.Builder;
import lombok.Data;

import java.time.ZoneId;
import java.util.UUID;

@Data
public class EsPromptRequest {

    public static EsPromptRequest of (Prompt prompt) {
        return EsPromptRequest.builder()
                .promptId(prompt.getId())
                .userId(prompt.getMemberUuid())
                .title(prompt.getTitle())
                .description(prompt.getDescription())
                .hit(prompt.getHit())
                .likeCnt(prompt.getHit())
                .regDt(prompt.getRegDt().atZone(ZoneId.systemDefault()).toEpochSecond())
                .updDt(prompt.getUpdDt().atZone(ZoneId.systemDefault()).toEpochSecond())
                .category(prompt.getCategory().toString())
                .prefix(prompt.getPrefix())
                .suffix(prompt.getSuffix())
                .example(prompt.getExample())
                .promptUuid(prompt.getPromptUuid())
                .originalPromptUuid(prompt.getOriginPromptUuid())
                .build();
    }

    private Long promptId;    // 내부 로직에서 사용하는 Auto Increment id
    private UUID userId;
    private String title;
    private String description;
    private Integer hit;
    private Integer likeCnt;
    private Long regDt;
    private Long updDt;
    private String category;
    private String prefix;
    private String suffix;
    private String example;
    private UUID promptUuid;
    private UUID originalPromptUuid;

    @Builder
    public EsPromptRequest(
            Long promptId,
            UUID userId,
            String title,
            String description,
            Integer hit,
            Integer likeCnt,
            Long regDt,
            Long updDt,
            String category,
            String prefix,
            String suffix,
            String example,
            UUID promptUuid,
            UUID originalPromptUuid
    ) {
        this.promptId = promptId;
        this.userId = userId;
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
        this.promptUuid = promptUuid;
        this.originalPromptUuid = originalPromptUuid;
    }
}
