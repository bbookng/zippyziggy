package com.zippyziggy.prompt.prompt.exception;

import lombok.Getter;

@Getter
public class PromptNotFoundException extends RuntimeException{
	public PromptNotFoundException() {
		super("존재하지 않는 프롬프트입니다.");
	}
}
