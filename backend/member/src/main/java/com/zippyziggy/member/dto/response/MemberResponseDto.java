package com.zippyziggy.member.dto.response;

import com.zippyziggy.member.model.RoleType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MemberResponseDto {

    private String nickname;
    private String profileImg;
    private String name;
    private RoleType role;
    private UUID userUuid;

}
