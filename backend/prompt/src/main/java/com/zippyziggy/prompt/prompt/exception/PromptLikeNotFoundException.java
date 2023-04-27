package com.zippyziggy.prompt.prompt.exception;

public class PromptLikeNotFoundException extends RuntimeException {
    public PromptLikeNotFoundException() {
        super("프롬프트를 좋아요한 적이 없습니다.");
    }
}
