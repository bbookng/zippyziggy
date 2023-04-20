package com.zippyziggy.prompt.prompt.service;

import java.time.LocalDateTime;
import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.zippyziggy.prompt.common.aws.AwsS3Uploader;
import com.zippyziggy.prompt.prompt.dto.request.PromptRequest;
import com.zippyziggy.prompt.prompt.dto.response.ForkPromptResponse;
import com.zippyziggy.prompt.prompt.dto.response.ForkedPromptListResponse;
import com.zippyziggy.prompt.prompt.model.Category;
import com.zippyziggy.prompt.prompt.model.Prompt;
import com.zippyziggy.prompt.prompt.repository.PromptRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ForkPromptService {

	private final AwsS3Uploader awsS3Uploader;
	private final PromptRepository promptRepository;

	public ForkPromptResponse createForkPrompt(String promptUuid, PromptRequest data, MultipartFile thumbnail) {

		String thumbnailUrl = awsS3Uploader.upload(thumbnail, "thumbnails");

		/*
		memberId 제대로 넣기
		 */
		Category category = Category.valueOf(data.getCategory());
		Prompt prompt = Prompt.builder()
			.title(data.getTitle())
			.category(category)
			.memberId(1L)
			.description(data.getDescription())
			.regDt(LocalDateTime.now())
			.updDt(LocalDateTime.now())
			.prefix(data.getMessage().getPrefix())
			.example(data.getMessage().getExample())
			.suffix(data.getMessage().getSuffix())
			.promptUuid(UUID.randomUUID().toString())
			.thumbnail(thumbnailUrl)
			.build();

		promptRepository.save(prompt);
		prompt.setOriginPromptUuid(promptUuid);

		return ForkPromptResponse.from(prompt);
	}

	public ForkedPromptListResponse getForkedPromptList(String promptUuid, Pageable pageable) {
		Page<Prompt> forkedPrompts = promptRepository.findAllByOriginPromptUuid(promptUuid, pageable);
		return ForkedPromptListResponse.from(forkedPrompts);
	}
}
