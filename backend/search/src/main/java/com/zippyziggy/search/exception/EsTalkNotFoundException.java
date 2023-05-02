package com.zippyziggy.search.exception;

public class EsTalkNotFoundException extends RuntimeException {

    private final String message;

    public EsTalkNotFoundException() {
        this.message = "ES에 존재하지 않는 톡입니다.";
    }
}
