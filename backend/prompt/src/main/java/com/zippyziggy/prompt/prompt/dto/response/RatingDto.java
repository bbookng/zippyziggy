package com.zippyziggy.prompt.prompt.dto.response;

import lombok.*;

import java.util.UUID;

@Data
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RatingDto {
    private Long prompId;
    private Integer hit;
    private Long likeCnt;
    private Integer score;
}
