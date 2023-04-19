package com.zippyziggy.prompt.prompt.service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.multipart.MultipartFile;

import com.zippyziggy.prompt.prompt.dto.request.PromptRequest;
import com.zippyziggy.prompt.prompt.dto.response.PromptDetailResponse;
import com.zippyziggy.prompt.prompt.dto.response.PromptResponse;

public interface PromptService {
	PromptResponse createPrompt(PromptRequest data, MultipartFile thumbnail);

	int updateHit(Long promptId, HttpServletRequest request, HttpServletResponse response);

	PromptDetailResponse findPromptById(Long promptId);

	void deletePrompt(Long promptId);
}
