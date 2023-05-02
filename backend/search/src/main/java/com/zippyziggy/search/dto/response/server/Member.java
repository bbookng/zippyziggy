package com.zippyziggy.search.dto.response.server;

import com.zippyziggy.search.dto.response.WriterResponse;
import com.zippyziggy.search.exception.MemberNotFoundException;
import java.util.UUID;
import lombok.Data;

@Data
public class Member {

    private UUID userUuid;
    private String nickname;
    private String profileImg;

    public WriterResponse of() throws MemberNotFoundException {
        return new WriterResponse(this.userUuid, this.profileImg, this.nickname);
    }
}
