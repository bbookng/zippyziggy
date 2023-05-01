package com.zippyziggy.member.dto.response;

import lombok.Data;

import java.util.UUID;

@Data
public class MemberResponse {
    private UUID userUuid;
    private String nickname;
    private String profileImg;

}
