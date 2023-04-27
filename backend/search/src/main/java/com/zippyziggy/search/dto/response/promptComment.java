package com.zippyziggy.search.dto.response;

import java.time.LocalDateTime;
import lombok.Data;
import net.bytebuddy.asm.Advice.Local;

@Data
public class promptComment {
    private final Long id;
    private final String memberUuid;
    private final String promptUuid;
    private final String content;
    private final LocalDateTime regDt;
    private final LocalDateTime updDt;
}
