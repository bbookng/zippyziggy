package com.zippyziggy.prompt.talk.service;

import com.zippyziggy.prompt.prompt.client.MemberClient;
import com.zippyziggy.prompt.prompt.dto.response.MemberResponse;
import com.zippyziggy.prompt.talk.dto.request.TalkCommentRequest;
import com.zippyziggy.prompt.talk.dto.response.TalkCommentListResponse;
import com.zippyziggy.prompt.talk.dto.response.TalkCommentResponse;
import com.zippyziggy.prompt.talk.exception.ForbiddenMemberException;
import com.zippyziggy.prompt.talk.exception.MemberNotFoundException;
import com.zippyziggy.prompt.talk.exception.TalkCommentNotFoundException;
import com.zippyziggy.prompt.talk.exception.TalkNotFoundException;
import com.zippyziggy.prompt.talk.model.Talk;
import com.zippyziggy.prompt.talk.model.TalkComment;
import com.zippyziggy.prompt.talk.repository.TalkCommentRepository;
import com.zippyziggy.prompt.talk.repository.TalkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cloud.client.circuitbreaker.CircuitBreaker;
import org.springframework.cloud.client.circuitbreaker.CircuitBreakerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class TalkCommentService {

	private final TalkCommentRepository talkCommentRepository;
	private final TalkRepository talkRepository;
	private final CircuitBreakerFactory circuitBreakerFactory;
	private final MemberClient memberClient;

	public TalkCommentListResponse getTalkCommentList(Long talkId, Pageable pageable) {
		CircuitBreaker circuitBreaker = circuitBreakerFactory.create("circuitBreaker");
		Page<TalkComment> commentList = talkCommentRepository.findAllByTalk_Id(talkId, pageable);

		List<TalkCommentResponse> talkCommentResponseList = commentList.stream().map(comment -> {
			MemberResponse writerInfo = circuitBreaker
					.run(() -> memberClient
							.getMemberInfo(comment.getMemberUUid())
							.orElseThrow(MemberNotFoundException::new));
			TalkCommentResponse talkCommentResponse = TalkCommentResponse.from(comment);
			talkCommentResponse.setMember(writerInfo);

			return talkCommentResponse;
		}).collect(Collectors.toList());

		Long commentCnt = talkCommentRepository.countAllByTalk_Id(talkId);

		return new TalkCommentListResponse(commentCnt, talkCommentResponseList);
	}

	public TalkCommentResponse createTalkComment(Long talkId, TalkCommentRequest data, UUID crntMemberUuid) {
		final Talk talk = talkRepository.findById(talkId)
				.orElseThrow(TalkNotFoundException::new);

		final TalkComment talkComment = TalkComment.from(data, crntMemberUuid, talk);
		talkCommentRepository.save(talkComment);

		return TalkCommentResponse.from(talkComment);
	}

	/*
	본인 댓글인지 확인하고 수정
	 */
	public TalkCommentResponse modifyTalkComment(Long commentId, TalkCommentRequest data, UUID crntMemberUuid) {
		TalkComment comment = talkCommentRepository.findById(commentId)
			.orElseThrow(TalkCommentNotFoundException::new);

		if (!crntMemberUuid.equals(comment.getMemberUUid())) {
			throw new ForbiddenMemberException();
		}

		comment.setContent(data.getContent());
		return TalkCommentResponse.from(comment);
	}

	/*
	본인 댓글인지 확인하고 삭제
	 */
	public void removeTalkComment(Long commentId, UUID crntMemberUuid) {
		TalkComment comment = talkCommentRepository.findById(commentId)
			.orElseThrow(TalkCommentNotFoundException::new);

		if (!crntMemberUuid.equals(comment.getMemberUUid())) {
			throw new ForbiddenMemberException();
		}

		talkCommentRepository.delete(comment);
	}
}
