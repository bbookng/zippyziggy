package com.zippyziggy.prompt.prompt.exception;

public class ForbiddenMemberException extends RuntimeException {

    public ForbiddenMemberException() {
        super("권한이 없는 사용자입니다.");
    }
}
