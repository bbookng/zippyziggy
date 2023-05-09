package com.zippyziggy.prompt.prompt.dto.request;

import lombok.Data;

@Data
public class ChatGptMessage {
    private String role;
    private String content;
}
