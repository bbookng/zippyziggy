package com.zippyziggy.exception;

public class PromptNotFoundException extends RuntimeException {

    private final String message;

    public PromptNotFoundException() {
        this.message = "존재하지 않는 프롬프트입니다.";
    }
}
