package com.zippyziggy.search.dto.response;

import com.zippyziggy.exception.MemberNotFoundException;
import java.util.UUID;
import lombok.Data;

@Data
public class Member {

    private UUID userUuid;
    private String nickname;
    private String profileImg;

    public Writer of() throws MemberNotFoundException {
        return new Writer(this.userUuid, this.profileImg, this.nickname);
    }
}
