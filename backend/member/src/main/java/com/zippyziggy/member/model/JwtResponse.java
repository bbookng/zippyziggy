package com.zippyziggy.member.model;

/**
 * MISMATCH: 유효하지 않은 토큰입니다.
 * EXPIRED: 유효 시간이 만료된 토큰입니다.
 * SUCCESS: 정상 토큰
 */
public enum JwtResponse {
    ACCESS_TOKEN_MISMATCH("access_token_mismatch"),
    ACCESS_TOKEN_EXPIRED("access_token_expired"),
    ACCESS_TOKEN_SUCCESS("access_token_success"),
    REFRESH_TOKEN_MISMATCH("access_token_mismatch"),
    REFRESH_TOKEN_EXPIRED("access_token_expired"),
    REFRESH_TOKEN_SUCCESS("access_token_success");

    private final String jwtResponse;

    JwtResponse(String jwtResponse) { this.jwtResponse = jwtResponse; }

    public String getJwtResponse() { return jwtResponse; }

}
