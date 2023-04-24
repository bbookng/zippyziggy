package com.zippyziggy.gateway.dto;

public enum JwtResponse {
    ACCESS_TOKEN_MISMATCH("access_token_mismatch"),
    ACCESS_TOKEN_EXPIRED("access_token_expired"),
    ACCESS_TOKEN_SUCCESS("access_token_success"),
    REFRESH_TOKEN_MISMATCH("refresh_token_mismatch"),
    REFRESH_TOKEN_EXPIRED("refresh_token_expired"),
    REFRESH_TOKEN_SUCCESS("refresh_token_success");

    private final String jwtResponse;

    JwtResponse(String jwtResponse) { this.jwtResponse = jwtResponse; }

    public String getJwtResponse() { return jwtResponse; }

}

