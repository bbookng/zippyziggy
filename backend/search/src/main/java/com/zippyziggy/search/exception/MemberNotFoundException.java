package com.zippyziggy.search.exception;

public class MemberNotFoundException extends RuntimeException {

    private final String message;

    public MemberNotFoundException() {
        this.message = "존재하지 않는 회원입니다.";
    }
}
