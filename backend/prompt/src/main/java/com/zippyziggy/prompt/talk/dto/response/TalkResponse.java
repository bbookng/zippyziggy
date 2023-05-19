package com.zippyziggy.prompt.talk.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TalkResponse {

    private Long talkId;
    private String title;
    private List<MessageResponse> messages;
    private LocalDateTime regDt;
    private UUID memberUuid;
}
