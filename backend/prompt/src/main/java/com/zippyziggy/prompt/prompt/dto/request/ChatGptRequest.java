package com.zippyziggy.prompt.prompt.dto.request;

import java.util.List;

public class ChatGptRequest {
    private String model;
    private List<ChatGptMessage> messages;

    public ChatGptRequest(String model, AppChatGptRequest data) {
        this.model = model;
        this.messages = data.messages;
    }
}
