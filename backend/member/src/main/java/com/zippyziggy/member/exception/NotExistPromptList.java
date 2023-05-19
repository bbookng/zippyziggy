package com.zippyziggy.member.exception;

import org.aspectj.weaver.ast.Not;

public class NotExistPromptList extends RuntimeException {
	public NotExistPromptList (){
		super("프롬프트 리스트가 존재하지 않습니다.");
	}
}
