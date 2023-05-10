package com.zippyziggy.prompt.prompt.service;

import com.zippyziggy.prompt.common.aws.AwsS3Uploader;
import com.zippyziggy.prompt.common.kafka.KafkaProducer;
import com.zippyziggy.prompt.prompt.client.MemberClient;
import com.zippyziggy.prompt.prompt.dto.request.PromptRequest;
import com.zippyziggy.prompt.prompt.dto.response.ForkPromptResponse;
import com.zippyziggy.prompt.prompt.dto.response.ForkedPromptListResponse;
import com.zippyziggy.prompt.prompt.dto.response.MemberResponse;
import com.zippyziggy.prompt.prompt.dto.response.PromptCardResponse;
import com.zippyziggy.prompt.prompt.model.Prompt;
import com.zippyziggy.prompt.prompt.model.StatusCode;
import com.zippyziggy.prompt.prompt.repository.PromptBookmarkRepository;
import com.zippyziggy.prompt.prompt.repository.PromptCommentRepository;
import com.zippyziggy.prompt.prompt.repository.PromptLikeRepository;
import com.zippyziggy.prompt.prompt.repository.PromptRepository;
import com.zippyziggy.prompt.talk.repository.TalkRepository;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.cloud.client.circuitbreaker.CircuitBreaker;
import org.springframework.cloud.client.circuitbreaker.CircuitBreakerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@Transactional
@RequiredArgsConstructor
public class ForkPromptService {

	private final AwsS3Uploader awsS3Uploader;
	private final PromptRepository promptRepository;
	private final PromptCommentRepository promptCommentRepository;
	private final PromptBookmarkRepository promptBookmarkRepository;
	private final PromptLikeRepository promptLikeRepository;
	private final TalkRepository talkRepository;
	private final MemberClient memberClient;
	private final CircuitBreakerFactory circuitBreakerFactory;
	private final KafkaProducer kafkaProducer;

	public ForkPromptResponse createForkPrompt(UUID promptUuid, PromptRequest data, @Nullable MultipartFile thumbnail, UUID crntMemberUuid) {

		String thumbnailUrl;

		if (thumbnail == null) {
			thumbnailUrl = "https://zippyziggy.s3.ap-northeast-2.amazonaws.com/default/noCardImg.png";
		} else {
			thumbnailUrl = awsS3Uploader.upload(thumbnail, "thumbnails");
		}

		Prompt prompt = Prompt.from(data, crntMemberUuid, thumbnailUrl);
		prompt.setOriginPromptUuid(promptUuid);

		promptRepository.save(prompt);

		kafkaProducer.send("create-prompt-topic", prompt.toEsPromptRequest());

		return ForkPromptResponse.from(prompt);
	}

	public ForkedPromptListResponse getForkedPromptList(UUID promptUuid, Pageable pageable, String crntMemberUuid) {

		Long forkPromptCnt = promptRepository.countAllByOriginPromptUuidAndStatusCode(promptUuid, StatusCode.OPEN);

		Page<Prompt> forkedPrompts = promptRepository.findAllByOriginPromptUuidAndStatusCode(promptUuid, StatusCode.OPEN, pageable);

		// fork 프롬프트들 카드 정보 가져오는 메서드
		List<PromptCardResponse> prompts = getForkedPromptResponses(forkedPrompts, UUID.fromString(crntMemberUuid));

		return new ForkedPromptListResponse(forkPromptCnt, prompts);
	}

	private List<PromptCardResponse> getForkedPromptResponses(Page<Prompt> forkedPrompts, @Nullable UUID crntMemberUuid) {
		CircuitBreaker circuitBreaker = circuitBreakerFactory.create("circuitBreaker");

		List<PromptCardResponse> promptDtoList = forkedPrompts.stream().map(prompt -> {
			MemberResponse writerInfo = circuitBreaker.run(() -> memberClient.getMemberInfo(prompt.getMemberUuid()));

			// 댓글, 포크 프롬프트의 포크 수, 대화 수 가져오기
			long commentCnt = promptCommentRepository.countAllByPromptPromptUuid(prompt.getPromptUuid());
			long forkCnt = promptRepository.countAllByOriginPromptUuidAndStatusCode(prompt.getPromptUuid(), StatusCode.OPEN);
			long talkCnt = talkRepository.countAllByPromptPromptUuid(prompt.getPromptUuid());

			// 좋아요, 북마크 여부
			boolean isLiked;
			boolean isBookmarked;

			// 현재 로그인된 사용자가 아니면 기본값 false
			if (crntMemberUuid.toString().equals("defaultValue")) {
				isBookmarked = false;
				isLiked = false;
			} else {
				isBookmarked = promptBookmarkRepository.findByMemberUuidAndPrompt(crntMemberUuid, prompt) != null
					? true : false;
				isLiked =  promptLikeRepository.findByPromptAndMemberUuid(prompt, crntMemberUuid) != null
					? true : false;
			}

			// DTO 로 변환
			PromptCardResponse promptDto = PromptCardResponse
				.from(writerInfo, prompt, commentCnt, forkCnt, talkCnt, isBookmarked, isLiked);

			return promptDto;

		}).collect(Collectors.toList());

		return promptDtoList;
	}

}
