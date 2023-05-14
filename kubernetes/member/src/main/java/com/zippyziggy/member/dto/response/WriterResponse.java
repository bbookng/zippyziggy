package com.zippyziggy.member.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;

import java.util.UUID;

@Data
@Getter
@Builder
@AllArgsConstructor
public class WriterResponse {
    private UUID writerUuid;
    private String writerImg;
    private String writerNickname;
}