package com.zippyziggy.prompt.prompt.dto.response;

import lombok.Data;

import java.util.UUID;

import com.zippyziggy.prompt.prompt.exception.MemberNotFoundException;

@Data
public class MemberResponse {

    private String nickname;
    private String profileImg;
    private UUID userUuid;

    public OriginerResponse toOriginerResponse() throws MemberNotFoundException {
        return new OriginerResponse(this.userUuid, this.profileImg, this.nickname);
    }

    public WriterResponse toWriterResponse() throws MemberNotFoundException {
        return new WriterResponse(this.userUuid, this.profileImg, this.nickname);
    }
}
