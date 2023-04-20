package com.zippyziggy.prompt.prompt.service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.multipart.MultipartFile;

import com.zippyziggy.prompt.prompt.dto.request.PromptRequest;
import com.zippyziggy.prompt.prompt.dto.response.ForkPromptResponse;
import com.zippyziggy.prompt.prompt.dto.response.PromptDetailResponse;
import com.zippyziggy.prompt.prompt.dto.response.PromptResponse;

public interface PromptService {
	PromptResponse createPrompt(PromptRequest data, MultipartFile thumbnail);

	int updateHit(String promptUuid, HttpServletRequest request, HttpServletResponse response);

	PromptDetailResponse findByPromptUuid(String promptUuid);

	void deletePrompt(String promptUuid);

	ForkPromptResponse createForkPrompt(String promptUuid, PromptRequest data, MultipartFile thumbnail);

	// PromptResponse createPromptTemp(PromptRequest data, MultipartFile thumbnail);
}
