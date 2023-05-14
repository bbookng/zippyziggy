package com.zippyziggy.member.dto.response;

import com.zippyziggy.member.model.JwtToken;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AppMemberResponse {

    private MemberInformResponseDto memberInformResponseDto;
    private JwtToken jwtToken;
}
