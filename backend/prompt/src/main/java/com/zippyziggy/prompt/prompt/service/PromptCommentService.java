package com.zippyziggy.prompt.prompt.service;

import java.time.LocalDateTime;
import java.util.UUID;

import javax.transaction.Transactional;

import com.zippyziggy.prompt.prompt.exception.ForbiddenMemberException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.zippyziggy.prompt.prompt.dto.request.PromptCommentRequest;
import com.zippyziggy.prompt.prompt.dto.response.PromptCommentListResponse;
import com.zippyziggy.prompt.prompt.dto.response.PromptCommentResponse;
import com.zippyziggy.prompt.prompt.exception.PromptCommentNotFoundException;
import com.zippyziggy.prompt.prompt.exception.PromptNotFoundException;
import com.zippyziggy.prompt.prompt.model.Prompt;
import com.zippyziggy.prompt.prompt.model.PromptComment;
import com.zippyziggy.prompt.prompt.repository.PromptCommentRepository;
import com.zippyziggy.prompt.prompt.repository.PromptRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class PromptCommentService {

	private final PromptCommentRepository promptCommentRepository;
	private final PromptRepository promptRepository;

	public PromptCommentListResponse getPromptCommentList(UUID promptUuid, Pageable pageable) {
		Page<PromptComment> commentList = promptCommentRepository.findAllByPromptPromptUuid(promptUuid, pageable);
		return PromptCommentListResponse.from(commentList);
	}

	public PromptCommentResponse createPromptComment(UUID promptUuid, PromptCommentRequest data, UUID crntMemberUuid) {
		Prompt prompt = promptRepository.findByPromptUuid(promptUuid).orElseThrow(PromptNotFoundException::new);

		PromptComment promptComment = PromptComment.from(data, crntMemberUuid, prompt);
		promptCommentRepository.save(promptComment);

		return PromptCommentResponse.from(promptComment);
	}

	/*
	본인 댓글인지 확인하고 수정
	 */
	public PromptCommentResponse modifyPromptComment(Long commentId, PromptCommentRequest data, UUID crntMemberUuid) {
		PromptComment comment = promptCommentRepository.findById(commentId)
			.orElseThrow(PromptCommentNotFoundException::new);

		if (crntMemberUuid != comment.getMemberUuid()) {
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

		if (crntMemberUuid != comment.getMemberUuid()) {
			throw new ForbiddenMemberException();
		}

		promptCommentRepository.delete(comment);
	}
}
