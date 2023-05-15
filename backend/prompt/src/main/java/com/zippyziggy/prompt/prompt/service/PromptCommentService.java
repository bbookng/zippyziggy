package com.zippyziggy.prompt.prompt.service;

import com.zippyziggy.prompt.common.kafka.KafkaProducer;
import com.zippyziggy.prompt.prompt.client.MemberClient;
import com.zippyziggy.prompt.prompt.dto.request.NoticeRequest;
import com.zippyziggy.prompt.prompt.dto.request.PromptCommentRequest;
import com.zippyziggy.prompt.prompt.dto.response.MemberResponse;
import com.zippyziggy.prompt.prompt.dto.response.PromptCommentListResponse;
import com.zippyziggy.prompt.prompt.dto.response.PromptCommentResponse;
import com.zippyziggy.prompt.prompt.exception.ForbiddenMemberException;
import com.zippyziggy.prompt.prompt.exception.PromptCommentNotFoundException;
import com.zippyziggy.prompt.prompt.exception.PromptNotFoundException;
import com.zippyziggy.prompt.prompt.model.Prompt;
import com.zippyziggy.prompt.prompt.model.PromptComment;
import com.zippyziggy.prompt.prompt.model.StatusCode;
import com.zippyziggy.prompt.prompt.repository.PromptCommentRepository;
import com.zippyziggy.prompt.prompt.repository.PromptRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.cloud.client.circuitbreaker.CircuitBreaker;
import org.springframework.cloud.client.circuitbreaker.CircuitBreakerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class PromptCommentService {

	private final PromptCommentRepository promptCommentRepository;
	private final PromptRepository promptRepository;
	private final CircuitBreakerFactory circuitBreakerFactory;
	private final MemberClient memberClient;
	private final KafkaProducer kafkaProducer;

	public PromptCommentListResponse getPromptCommentList(UUID promptUuid, Pageable pageable) {
		CircuitBreaker circuitBreaker = circuitBreakerFactory.create("circuitBreaker");
		Page<PromptComment> commentList = promptCommentRepository.findAllByPromptPromptUuid(promptUuid, pageable);

		List<PromptCommentResponse> promptCommentResponseList = commentList.stream().map(comment -> {
			MemberResponse writerInfo = circuitBreaker.run(() -> memberClient.getMemberInfo(comment.getMemberUuid()));
			PromptCommentResponse promptcommentList = PromptCommentResponse.from(comment);
			promptcommentList.setMember(writerInfo);

			return promptcommentList;
		}).collect(Collectors.toList());

		Long commentCnt = promptCommentRepository.countAllByPromptPromptUuid(promptUuid);

		return new PromptCommentListResponse(commentCnt, promptCommentResponseList);
	}

	public PromptCommentResponse createPromptComment(UUID promptUuid, PromptCommentRequest data, UUID crntMemberUuid) {
		Prompt prompt = promptRepository.findByPromptUuidAndStatusCode(promptUuid, StatusCode.OPEN).orElseThrow(PromptNotFoundException::new);

		PromptComment promptComment = PromptComment.from(data, crntMemberUuid, prompt);
		promptCommentRepository.save(promptComment);
		kafkaProducer.sendNotification("send-notification",
			new NoticeRequest(prompt.getMemberUuid().toString(),
				"'" + prompt.getTitle() + "'" + "게시물에 댓글이 등록되었습니다.",
				"https://zippyziggy.kr/prompts/" + prompt.getPromptUuid().toString()));

		return PromptCommentResponse.from(promptComment);
	}

	/*
	본인 댓글인지 확인하고 수정
	 */
	public PromptCommentResponse modifyPromptComment(Long commentId, PromptCommentRequest data, UUID crntMemberUuid) {
		PromptComment comment = promptCommentRepository.findById(commentId)
			.orElseThrow(PromptCommentNotFoundException::new);

		if (!crntMemberUuid.equals(comment.getMemberUuid())) {
			throw new ForbiddenMemberException();
		}

		comment.setContent(data.getContent());
		comment.setUpdDt(LocalDateTime.now());
		return PromptCommentResponse.from(comment);
	}

	/*
	본인 댓글인지 확인하고 삭제
	 */
	public void removePromptComment(Long commentId, UUID crntMemberUuid) {
		PromptComment comment = promptCommentRepository.findById(commentId)
			.orElseThrow(PromptCommentNotFoundException::new);

		if (!crntMemberUuid.equals(comment.getMemberUuid())) {
			throw new ForbiddenMemberException();
		}

		promptCommentRepository.delete(comment);
	}
}
