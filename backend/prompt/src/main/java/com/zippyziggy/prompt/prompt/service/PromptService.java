package com.zippyziggy.prompt.prompt.service;

import org.springframework.web.multipart.MultipartFile;

import com.zippyziggy.prompt.prompt.dto.request.PromptRequest;
import com.zippyziggy.prompt.prompt.dto.response.PromptDetailResponse;
import com.zippyziggy.prompt.prompt.dto.response.PromptResponse;

public interface PromptService {
	PromptResponse createPrompt(PromptRequest data, MultipartFile thumbnail);

	void updateHit(Long promptId);

	PromptDetailResponse findPromptById(Long promptId);

	void deletePrompt(Long promptId);
}
