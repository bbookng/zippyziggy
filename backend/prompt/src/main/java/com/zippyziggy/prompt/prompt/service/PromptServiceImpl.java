package com.zippyziggy.prompt.prompt.service;

import java.time.LocalDateTime;
import java.util.UUID;

import javax.transaction.Transactional;
import org.springframework.stereotype.Service;

import com.zippyziggy.prompt.prompt.dto.request.PromptRequest;
import com.zippyziggy.prompt.prompt.dto.response.MessageResponse;
import com.zippyziggy.prompt.prompt.dto.response.PromptDetailResponse;
import com.zippyziggy.prompt.prompt.dto.response.PromptResponse;
import com.zippyziggy.prompt.prompt.model.Category;
import com.zippyziggy.prompt.prompt.model.Prompt;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class PromptServiceImpl implements PromptService{

	@Override
	public PromptResponse createPrompt(PromptRequest data) {

		Category category = Category.valueOf(data.getCategory());
		Prompt prompt = Prompt.builder()
			.title(data.getTitle())
			.category(category)
			.memberId(1L)
			.description(data.getContent())
			.regDt(LocalDateTime.now())
			.updDt(LocalDateTime.now())
			.prefix(data.getMessage().getPrefix())
			.example(data.getMessage().getExample())
			.suffix(data.getMessage().getSuffix())
			.promptUuid(UUID.randomUUID().toString())
			.thumbnail(data.getThumbnail())
			.build();

		MessageResponse messageResponse = new MessageResponse(prompt.getPrefix(), prompt.getExample(),
			prompt.getSuffix());

		PromptResponse promptResponse = PromptResponse.builder()
			.title(prompt.getTitle())
			.content(prompt.getDescription())
			.thumbnail(prompt.getThumbnail())
			.category(prompt.getCategory().toString())
			.message(messageResponse)
			.build();

		return promptResponse;
	}

	@Override
	public void updateHit(Long promptId) {

	}

	@Override
	public PromptDetailResponse findPromptById(Long promptId) {
		return null;
	}

	@Override
	public void deletePrompt(Long promptId) {

	}
}
