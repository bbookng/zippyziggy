package com.zippyziggy.prompt.talk.exception;

public class DuplicatedTalkLikeException extends RuntimeException {

    public DuplicatedTalkLikeException() {
        super("이미 좋아요했거나 좋아요 취소했습니다.");
    }
}
