package com.zippyziggy.search.exception;

public class EsPromptNotFoundException extends RuntimeException {

    private final String message;

    public EsPromptNotFoundException() {
        this.message = "ES에 존재하지 않는 프롬프트입니다.";
    }
}
