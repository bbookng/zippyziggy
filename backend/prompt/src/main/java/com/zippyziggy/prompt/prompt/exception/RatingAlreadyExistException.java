package com.zippyziggy.prompt.prompt.exception;

public class RatingAlreadyExistException extends RuntimeException{
    public RatingAlreadyExistException() { super("평가 내역이 이미 존재합니다.");}
}
