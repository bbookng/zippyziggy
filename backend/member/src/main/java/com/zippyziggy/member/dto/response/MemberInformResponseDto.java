package com.zippyziggy.member.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MemberInformResponseDto {

    private String nickname;
    private String profileImg;
    private UUID userUuid;

}
