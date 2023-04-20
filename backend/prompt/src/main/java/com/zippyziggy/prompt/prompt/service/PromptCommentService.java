package com.zippyziggy.prompt.prompt.service;

import java.time.LocalDateTime;
import java.util.Optional;

import javax.transaction.Transactional;

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

	public PromptCommentListResponse getPromptCommentList(String promptUuid, Pageable pageable) {
		Page<PromptComment> commentList = promptCommentRepository.findAllByPromptUuid(promptUuid, pageable);
		return PromptCommentListResponse.from(commentList);
	}

	public PromptCommentResponse createPromptComment(String promptUuid, PromptCommentRequest data) {
		Prompt prompt = promptRepository.findByPromptUuid(promptUuid).orElseThrow(PromptNotFoundException::new);

		// 댓글 작성자 추가 필요
		PromptComment promptComment = PromptComment.builder()
			.prompt(prompt)
			.regDt(LocalDateTime.now())
			.content(data.getContent())
			.build();

		return PromptCommentResponse.from(promptComment);
	}

	public PromptCommentResponse modifyPromptComment(Long commentId, PromptCommentRequest data) {
		PromptComment comment = promptCommentRepository.findById(commentId)
			.orElseThrow(PromptCommentNotFoundException::new);
		comment.setContent(data.getContent());
		comment.setUpdDt(LocalDateTime.now());
		return PromptCommentResponse.from(comment);
	}

	public void removePromptComment(Long commentId) {
		PromptComment comment = promptCommentRepository.findById(commentId)
			.orElseThrow(PromptCommentNotFoundException::new);
		promptCommentRepository.delete(comment);
	}
}
