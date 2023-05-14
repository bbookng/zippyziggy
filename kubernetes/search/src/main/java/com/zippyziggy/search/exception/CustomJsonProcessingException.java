package com.zippyziggy.search.exception;

public class CustomJsonProcessingException extends RuntimeException{

    private final String message;

    public CustomJsonProcessingException() {
        this.message = "json 객체를 다른 객체로 변환할 수 없습니다";
    }
}
