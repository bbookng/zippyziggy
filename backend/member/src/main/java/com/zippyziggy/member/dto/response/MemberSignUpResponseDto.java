package com.zippyziggy.member.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MemberSignUpResponseDto {

    private Boolean isSignUp;
    private MemberInformResponseDto memberInformResponseDto;

}

