package com.zippyziggy.search.dto.response;

import java.util.UUID;
import lombok.Data;

@Data
public class WriterResponse {
    private final UUID writerUuid;
    private final String writerImg;
    private final String writerNickname;
}