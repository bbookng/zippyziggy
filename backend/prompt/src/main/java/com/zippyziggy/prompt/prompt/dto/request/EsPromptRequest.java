package com.zippyziggy.prompt.prompt.dto.request;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class EsPromptRequest {

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

}
