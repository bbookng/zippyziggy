package com.zippyziggy.search.exception;

public class TalkNotFoundException extends RuntimeException {

    private final String message;

    public TalkNotFoundException() {
        this.message = "존재하지 않는 톡입니다.";
    }
}
