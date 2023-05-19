package com.zippyziggy.member.dto.response;

import com.zippyziggy.member.model.Member;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MemberIdResponse {
    private Long id;
    private String memberUuid;

    public static MemberIdResponse from(Member member) {
        return MemberIdResponse.builder()
                .id(member.getId())
                .memberUuid(member.getUserUuid().toString())
                .build();
    }
}
