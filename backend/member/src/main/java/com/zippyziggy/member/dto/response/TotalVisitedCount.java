package com.zippyziggy.member.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TotalVisitedCount {
    private String totalTempDate;
    private Long totalVisitedCount;
}
