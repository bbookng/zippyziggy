package com.zippyziggy.gateway.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JwtPayLoadResponseDto {

    private String sub;
    private UUID userUuid;
    private String nickname;
    private Long exp;

    public String getSub() {
        return this.sub;
    }

}
