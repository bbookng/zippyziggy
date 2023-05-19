package com.zippyziggy.search.dto.response.server;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class PromptComment {
    private final Long id;
    private final String memberUuid;
    private final String promptUuid;
    private final String content;
    private final LocalDateTime regDt;
    private final LocalDateTime updDt;
}
