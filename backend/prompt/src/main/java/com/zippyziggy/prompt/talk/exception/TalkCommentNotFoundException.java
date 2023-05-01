package com.zippyziggy.prompt.talk.exception;

public class TalkCommentNotFoundException extends RuntimeException{
	public TalkCommentNotFoundException() {
		super("존재하지 않는 댓글입니다.");
	}
}
