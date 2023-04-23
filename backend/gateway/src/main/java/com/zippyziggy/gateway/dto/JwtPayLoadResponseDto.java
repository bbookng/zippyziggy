package com.zippyziggy.gateway.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class JwtPayLoadResponseDto {

    private String sub;
    private String userUuid;
    private String nickname;
    private Long exp;

    public String getSub() {
        return this.sub;
    }

    public String getUserUuid() {
        return this.userUuid;
    }

    public String getNickname() {
        return this.nickname;
    }

    public Long getExp() {
        return this.exp;
    }
}
