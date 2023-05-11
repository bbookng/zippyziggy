package com.zippyziggy.prompt.prompt.dto.request;

import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ChatGptRequest {
    private String model;
    private List<ChatGptMessage> messages;

    public ChatGptRequest(String model, List<ChatGptMessage> messages) {
        this.model = model;
        this.messages = messages;
    }

    public ChatGptRequest(String model, AppChatGptRequest data) {
        this.model = model;
        this.messages = data.messages;
    }
}
