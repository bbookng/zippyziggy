package com.zippyziggy.prompt.talk.exception;

public class TalkLikeNotFoundException extends RuntimeException {

    public TalkLikeNotFoundException() {
        super("좋아요하지 않은 톡입니다.");
    }
}
