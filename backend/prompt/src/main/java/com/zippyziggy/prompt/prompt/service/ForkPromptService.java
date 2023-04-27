package com.zippyziggy.prompt.prompt.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.cloud.client.circuitbreaker.CircuitBreaker;
import org.springframework.cloud.client.circuitbreaker.CircuitBreakerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.zippyziggy.prompt.common.aws.AwsS3Uploader;
import com.zippyziggy.prompt.prompt.client.MemberClient;
import com.zippyziggy.prompt.prompt.dto.request.PromptRequest;
import com.zippyziggy.prompt.prompt.dto.response.ForkPromptResponse;
import com.zippyziggy.prompt.prompt.dto.response.ForkedPromptListResponse;
import com.zippyziggy.prompt.prompt.dto.response.ForkedPromptResponse;
import com.zippyziggy.prompt.prompt.dto.response.MemberResponse;
import com.zippyziggy.prompt.prompt.exception.MemberNotFoundException;
import com.zippyziggy.prompt.prompt.model.Prompt;
import com.zippyziggy.prompt.prompt.repository.PromptBookmarkRepository;
import com.zippyziggy.prompt.prompt.repository.PromptCommentRepository;
import com.zippyziggy.prompt.prompt.repository.PromptLikeRepository;
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
	private final MemberClient memberClient;
	private final CircuitBreakerFactory circuitBreakerFactory;
	private final PromptBookmarkRepository promptBookmarkRepository;
	private final PromptLikeRepository promptLikeRepository;

	public ForkPromptResponse createForkPrompt(UUID promptUuid, PromptRequest data, MultipartFile thumbnail, UUID crntMemberUuid) {

		String thumbnailUrl = awsS3Uploader.upload(thumbnail, "thumbnails");

		Prompt prompt = Prompt.from(data, crntMemberUuid, thumbnailUrl);
		prompt.setOriginPromptUuid(promptUuid);

		promptRepository.save(prompt);

		return ForkPromptResponse.from(prompt);
	}

	public ForkedPromptListResponse getForkedPromptList(UUID promptUuid, Pageable pageable, String crntMemberUuid) {

		Page<Prompt> forkedPrompts = promptRepository.findAllByOriginPromptUuid(promptUuid, pageable);

		// fork 프롬프트들 카드 정보 가져오는 메서드
		List<ForkedPromptResponse> prompts = getForkedPromptResponses(forkedPrompts, UUID.fromString(crntMemberUuid));

		return new ForkedPromptListResponse(prompts.size(), prompts);
	}

	private List<ForkedPromptResponse> getForkedPromptResponses(Page<Prompt> forkedPrompts, @Nullable UUID crntMemberUuid) {
		CircuitBreaker circuitBreaker = circuitBreakerFactory.create("circuitBreaker");


		List<ForkedPromptResponse> promptDtoList = forkedPrompts.stream().map(prompt -> {
			MemberResponse writerInfo = circuitBreaker.run(() -> memberClient.getMemberInfo(prompt.getMemberUuid())
				.orElseThrow(MemberNotFoundException::new), throwable -> null);


			// 댓글, 포크 프롬프트의 포크 수, 대화 수 가져오기
			long commentCnt = promptCommentRepository.findAllByPromptPromptUuid(prompt.getPromptUuid()).size();
			long forkCnt = promptRepository.findAllByOriginPromptUuid(prompt.getPromptUuid()).size();
			long talkCnt = talkRepository.findAllByPromptPromptUuid(prompt.getPromptUuid()).size();

			// 좋아요, 북마크 여부
			boolean isLiked;
			boolean isBookmarked;

			// 현재 로그인된 사용자가 아니면 기본값 false
			if (crntMemberUuid.equals("defaultValue")) {
				isBookmarked = false;
				isLiked = false;
			} else {
				isBookmarked = (promptBookmarkRepository.countAllByMemberUuidAndPrompt(crntMemberUuid, prompt) % 2 > 0) ? true : false;
				isLiked =  (promptLikeRepository.countAllByMemberUuidAndPrompt(crntMemberUuid, prompt) % 2 > 0) ? true : false;
			}

			// DTO 로 변환
			ForkedPromptResponse promptDto = ForkedPromptResponse
				.from(writerInfo, prompt, commentCnt, forkCnt, talkCnt, isBookmarked, isLiked);

			return promptDto;

		}).collect(Collectors.toList());

		return promptDtoList;
	}

}
