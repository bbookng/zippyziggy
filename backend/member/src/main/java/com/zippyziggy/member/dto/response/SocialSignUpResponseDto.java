package com.zippyziggy.member.dto.response;

import com.zippyziggy.member.model.Platform;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Kakao, Google에서 받은 정보를 정제해서 회원가입을 위해 프런트로 전송
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SocialSignUpResponseDto {

    private Boolean isMember;
    private String profileImg;
    private String name;
    private Platform platform;
    private String platformId;

}
