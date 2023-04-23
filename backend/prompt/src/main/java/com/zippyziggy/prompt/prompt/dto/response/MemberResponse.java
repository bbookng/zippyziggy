package com.zippyziggy.prompt.prompt.dto.response;

import lombok.Data;

import java.util.UUID;

@Data
public class MemberResponse {
    private UUID memberUuid;
    private String nickname;
    private String memberImg;

    public OriginerResponse toOriginerResponse() {
        return new OriginerResponse(this.memberUuid, this.memberImg, this.nickname);
    }

    public WriterResponse toWriterResponse() {
        return new WriterResponse(this.memberUuid, this.memberImg, this.nickname);
    }
}
