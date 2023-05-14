package com.zippyziggy.prompt.prompt.dto.request;

import java.util.List;
import lombok.Data;

@Data
public class AppChatGptRequest {
    List<ChatGptMessage> messages;
}
