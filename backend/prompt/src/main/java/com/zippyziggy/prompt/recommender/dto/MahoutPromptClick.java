package com.zippyziggy.prompt.recommender.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MahoutPromptClick {
    private Long memberId;
    private Long promptId;
    private Long clickCnt;
}
