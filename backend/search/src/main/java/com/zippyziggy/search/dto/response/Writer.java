package com.zippyziggy.search.dto.response;

import java.util.UUID;
import lombok.Data;

@Data
public class Writer {
    private final UUID userUuid;
    private final String nickname;
    private final String profileImg;
}
