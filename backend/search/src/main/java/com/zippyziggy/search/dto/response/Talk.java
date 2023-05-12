package com.zippyziggy.search.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import jdk.dynalink.linker.LinkerServices;
import lombok.Data;

@Data
public class Talk {
    private final Long id;
    private final Long memberId;
    private final String title;
    private final LocalDateTime regDt;
    private final Long likeCnt;
    private final List<Message> messsages;
}
