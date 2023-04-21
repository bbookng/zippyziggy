package com.zippyziggy.prompt.prompt.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.zippyziggy.prompt.common.aws.AwsS3Uploader;
import com.zippyziggy.prompt.prompt.dto.request.PromptRequest;
import com.zippyziggy.prompt.prompt.dto.response.ForkPromptResponse;
import com.zippyziggy.prompt.prompt.dto.response.ForkedPromptListResponse;
import com.zippyziggy.prompt.prompt.dto.response.ForkedPromptResponse;
import com.zippyziggy.prompt.prompt.model.Category;
import com.zippyziggy.prompt.prompt.model.Languages;
import com.zippyziggy.prompt.prompt.model.Prompt;
import com.zippyziggy.prompt.prompt.repository.PromptCommentRepository;
import com.zippyziggy.prompt.prompt.repository.PromptRepository;
import com.zippyziggy.prompt.talk.repository.TalkRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ForkPromptService {

	private final AwsS3Uploader awsS3Uploader;
	private final PromptRepository promptRepository;
	private final PromptCommentRepository promptCommentRepository;
	private final TalkRepository talkRepository;

	public ForkPromptResponse createForkPrompt(UUID promptUuid, PromptRequest data, MultipartFile thumbnail) {

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
			.hit(0)
			.likeCnt(0L)
			.promptUuid(UUID.randomUUID())
			.originPromptUuid(promptUuid)
			.thumbnail(thumbnailUrl)
			.languages(Languages.KOREAN)
			.build();

		promptRepository.save(prompt);

		return ForkPromptResponse.from(prompt);
	}

	public ForkedPromptListResponse getForkedPromptList(UUID promptUuid, Pageable pageable) {

		Page<Prompt> forkedPrompts = promptRepository.findAllByOriginPromptUuid(promptUuid, pageable);

		// fork 프롬프트들 카드 정보 가져오는 메서드
		List<ForkedPromptResponse> prompts = getForkedPromptResponses(forkedPrompts);

		return new ForkedPromptListResponse(prompts.size(), prompts);
	}

	private List<ForkedPromptResponse> getForkedPromptResponses(Page<Prompt> forkedPrompts) {
		List<ForkedPromptResponse> promptDtoList = forkedPrompts.stream().map(prompt -> {

			// 댓글, 포크 프롬프트의 포크 수, 대화 수 가져오기
			long commentCnt = promptCommentRepository.findAllByPromptPromptUuid(prompt.getPromptUuid()).size();
			long forkCnt = promptRepository.findAllByOriginPromptUuid(prompt.getPromptUuid()).size();
			long talkCnt = talkRepository.findAllByPromptPromptUuid(prompt.getPromptUuid()).size();

			// DTO 로 변환
			ForkedPromptResponse promptDto = ForkedPromptResponse.from(prompt, commentCnt, forkCnt, talkCnt);

			return promptDto;

		}).collect(Collectors.toList());

		return promptDtoList;
	}

}
