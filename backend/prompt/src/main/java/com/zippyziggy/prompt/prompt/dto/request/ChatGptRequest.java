package com.zippyziggy.prompt.prompt.dto.request;

import java.util.List;

public class ChatGptRequest {
    private final String model;
    private final List<ChatGptMessage> messages;

    public ChatGptRequest(String model, AppChatGptRequest data) {
        this.model = model;
        this.messages = data.messages;
    }
}
