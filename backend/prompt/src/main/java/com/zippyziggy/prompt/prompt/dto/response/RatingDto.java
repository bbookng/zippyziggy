package com.zippyziggy.prompt.prompt.dto.response;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;

import java.util.UUID;

@Data
@Getter
@Builder
public class RatingDto {
    private Long prompId;
    private Integer hit;
    private Long likeCnt;
    private Integer score;
}
