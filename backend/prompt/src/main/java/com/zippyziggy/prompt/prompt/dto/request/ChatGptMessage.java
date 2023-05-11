package com.zippyziggy.prompt.prompt.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ChatGptMessage {
    private String role;
    private String content;

    public ChatGptMessage(String role, String content) {
        this.role = role;
        this.content = content;
    }
}
