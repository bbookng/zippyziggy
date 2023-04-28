package com.zippyziggy.search.dto.request;

import lombok.Data;

@Data
public class SyncEsPrompt {
    private Long promptId;    // 내부 로직에서 사용하는 Auto Increment id
    private Long userId;
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
    private String promptUuid;
    private String originalPromptUuid;
}
