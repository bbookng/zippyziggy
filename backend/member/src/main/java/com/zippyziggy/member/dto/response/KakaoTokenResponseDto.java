package com.zippyziggy.member.dto.response;

import lombok.Data;

@Data
public class KakaoTokenResponseDto {

    public String access_token;
    public String token_type;
    public String refresh_token;
    public Integer expires_in;
    public String scope;
    public Integer refresh_token_expires_in;

}
