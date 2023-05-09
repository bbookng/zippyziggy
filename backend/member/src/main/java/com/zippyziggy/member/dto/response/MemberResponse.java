package com.zippyziggy.member.dto.response;

import com.zippyziggy.member.model.Member;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MemberResponse {

    private String nickname;
    private String profileImg;
    private UUID userUuid;

    public static MemberResponse from(Member member) {
        return MemberResponse.builder()
                .nickname(member.getNickname())
                .profileImg(member.getProfileImg())
                .userUuid(member.getUserUuid()).build();
    }
}
