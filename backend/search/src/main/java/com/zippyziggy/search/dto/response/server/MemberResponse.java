package com.zippyziggy.search.dto.response.server;

import com.zippyziggy.search.dto.response.OriginerResponse;
import com.zippyziggy.search.dto.response.WriterResponse;
import lombok.Data;

import java.util.UUID;

@Data
public class MemberResponse {

    private String userUuid;
    private String nickname;
    private String profileImg;

    public OriginerResponse toOriginerResponse() {
        return new OriginerResponse(this.userUuid, this.profileImg, this.nickname);
    }

    public WriterResponse toWriterResponse() {
        return new WriterResponse(this.userUuid, this.profileImg, this.nickname);
    }
}
