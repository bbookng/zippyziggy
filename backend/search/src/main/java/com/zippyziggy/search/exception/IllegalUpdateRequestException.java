package com.zippyziggy.search.exception;

public class IllegalUpdateRequestException extends RuntimeException {

    private final String message;

    public IllegalUpdateRequestException() {
        this.message = "잘못된 Elasticsearch 업데이트 요청입니다.";
    }
}
