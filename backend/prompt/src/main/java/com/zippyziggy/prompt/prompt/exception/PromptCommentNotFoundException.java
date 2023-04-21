package com.zippyziggy.prompt.prompt.exception;

public class PromptCommentNotFoundException extends RuntimeException{
	public PromptCommentNotFoundException() {
		super("존재하지 않는 댓글입니다.");
	}
}
