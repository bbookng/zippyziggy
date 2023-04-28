package com.zippyziggy.search.dto.response;

import java.util.UUID;
import lombok.Data;

@Data
public class Writer {
    private final UUID writerUuid;
    private final String writerImg;
    private final String writerNickname;
}
