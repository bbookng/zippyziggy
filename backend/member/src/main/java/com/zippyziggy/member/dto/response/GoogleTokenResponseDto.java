package com.zippyziggy.member.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GoogleTokenResponseDto {

    private String access_token;
    private Integer expires_in;
    private String token_type;
    private String scope;
    private String refresh_token;

}
