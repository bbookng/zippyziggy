package com.zippyziggy.prompt.prompt.exception;

public class RatingNotFoundException extends RuntimeException {
    public RatingNotFoundException() {
        super("평가 내역이 존재하지 않습니다.");
    }
}
