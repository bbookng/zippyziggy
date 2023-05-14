package com.zippyziggy.prompt.prompt.exception;

public class ReportAlreadyExistException extends RuntimeException{
    public ReportAlreadyExistException() {super("이미 신고 내역이 존재합니다.");}
}
