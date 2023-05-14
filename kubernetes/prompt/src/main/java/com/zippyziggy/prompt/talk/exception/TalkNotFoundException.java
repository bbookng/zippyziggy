package com.zippyziggy.prompt.talk.exception;

public class TalkNotFoundException extends RuntimeException {
	public TalkNotFoundException() {
		super("존재하지 않는 대화입니다.");
	}
}
