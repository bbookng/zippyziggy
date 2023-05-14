package com.zippyziggy.member.dto.response;

import com.zippyziggy.member.model.Platform;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SocialSignUpDataResponseDto {

    private String profileImg;
    private String name;
    private Platform platform;
    private String platformId;

    public static SocialSignUpDataResponseDto fromKakao(KakaoUserInfoResponseDto kakaoUserInfo) {
        return SocialSignUpDataResponseDto.builder()
                .name(kakaoUserInfo.getProperties().getNickname())
                .profileImg(kakaoUserInfo.getProperties().getProfile_image())
                .platform(Platform.KAKAO)
                .platformId(kakaoUserInfo.getId()).build();
    }

    public static SocialSignUpDataResponseDto fromGoogle(GoogleUserInfoResponseDto googleProfile) {
        return SocialSignUpDataResponseDto.builder()
                .name(googleProfile.getName())
                .profileImg(googleProfile.getPicture())
                .platform(Platform.GOOGLE)
                .platformId(googleProfile.getId()).build();
    }
}
