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

}
