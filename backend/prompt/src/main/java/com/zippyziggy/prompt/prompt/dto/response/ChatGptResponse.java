package com.zippyziggy.prompt.prompt.dto.response;

import com.zippyziggy.prompt.prompt.dto.request.ChatGptMessage;
import java.util.List;
import lombok.Data;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Data
public class ChatGptResponse {

    public List<Choice> choices;

    @Getter
    @Setter
    @RequiredArgsConstructor
    public static class Choice {
        private int index;
        private ChatGptMessage message;
    }

}
