package com.zippyziggy.search.dto.response;

import lombok.Data;

@Data
public class Message {
    private final Long id;
    private final Long talkId;
    private final String content;
}
