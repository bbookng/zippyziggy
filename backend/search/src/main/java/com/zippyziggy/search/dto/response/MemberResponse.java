package com.zippyziggy.search.dto.response;

import com.zippyziggy.search.exception.MemberNotFoundException;
import java.util.UUID;
import lombok.Data;

@Data
public class MemberResponse {

    private UUID userUuid;
    private String nickname;
    private String profileImg;

    public OriginerResponse toOriginerResponse() throws MemberNotFoundException {
        return new OriginerResponse(this.userUuid, this.profileImg, this.nickname);
    }

    public WriterResponse toWriterResponse() throws MemberNotFoundException {
        return new WriterResponse(this.userUuid, this.profileImg, this.nickname);
    }
}
