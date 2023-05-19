package com.zippyziggy.prompt.talk.service;

import com.zippyziggy.prompt.prompt.client.MemberClient;
import com.zippyziggy.prompt.prompt.dto.response.MemberResponse;
import com.zippyziggy.prompt.talk.dto.request.TalkCommentRequest;
import com.zippyziggy.prompt.talk.dto.response.TalkCommentListResponse;
import com.zippyziggy.prompt.talk.dto.response.TalkCommentResponse;
import com.zippyziggy.prompt.talk.exception.ForbiddenMemberException;
import com.zippyziggy.prompt.talk.exception.TalkCommentNotFoundException;
import com.zippyziggy.prompt.talk.exception.TalkNotFoundException;
import com.zippyziggy.prompt.talk.model.Talk;
import com.zippyziggy.prompt.talk.model.TalkComment;
import com.zippyziggy.prompt.talk.repository.TalkCommentRepository;
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
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class TalkCommentService {

	private final TalkCommentRepository talkCommentRepository;
	private final TalkRepository talkRepository;
	private final CircuitBreakerFactory circuitBreakerFactory;
	private final MemberClient memberClient;

	public TalkCommentListResponse getTalkCommentList(Long talkId, Pageable pageable) {
		final CircuitBreaker circuitBreaker = circuitBreakerFactory.create("circuitBreaker");
		final Page<TalkComment> commentList = talkCommentRepository.findAllByTalk_Id(talkId, pageable);

		final List<TalkCommentResponse> talkCommentResponseList = commentList.stream().map(comment -> {
			MemberResponse writerInfo = circuitBreaker.run(() -> memberClient.getMemberInfo(comment.getMemberUuid()));
			return TalkCommentResponse.from(comment, writerInfo);
		}).collect(Collectors.toList());

		Long commentCnt = talkCommentRepository.countAllByTalk_Id(talkId);

		return new TalkCommentListResponse(commentCnt, talkCommentResponseList);
	}

	public TalkCommentResponse createTalkComment(Long talkId, TalkCommentRequest data, UUID crntMemberUuid) {
		final Talk talk = talkRepository.findById(talkId)
				.orElseThrow(TalkNotFoundException::new);

		final TalkComment talkComment = TalkComment.from(data, crntMemberUuid, talk);
		talkCommentRepository.save(talkComment);

		final CircuitBreaker circuitBreaker = circuitBreakerFactory.create("circuitBreaker");
		final MemberResponse talkCommentMember = circuitBreaker.run(() -> memberClient.getMemberInfo(talkComment.getMemberUuid()));

		return TalkCommentResponse.from(talkComment, talkCommentMember);
	}

	/*
	본인 댓글인지 확인하고 수정
	 */
	public TalkCommentResponse modifyTalkComment(Long commentId, TalkCommentRequest data, UUID crntMemberUuid) {
		final TalkComment comment = talkCommentRepository.findById(commentId)
			.orElseThrow(TalkCommentNotFoundException::new);

		if (!crntMemberUuid.equals(comment.getMemberUuid())) {
			throw new ForbiddenMemberException();
		}

		final CircuitBreaker circuitBreaker = circuitBreakerFactory.create("circuitBreaker");
		final MemberResponse talkCommentMember = circuitBreaker.run(() -> memberClient.getMemberInfo(comment.getMemberUuid()));

		comment.setContent(data.getContent());
		return TalkCommentResponse.from(comment, talkCommentMember);
	}

	/*
	본인 댓글인지 확인하고 삭제
	 */
	public void removeTalkComment(Long commentId, UUID crntMemberUuid) {
		TalkComment comment = talkCommentRepository.findById(commentId)
			.orElseThrow(TalkCommentNotFoundException::new);

		if (!crntMemberUuid.equals(comment.getMemberUuid())) {
			throw new ForbiddenMemberException();
		}

		talkCommentRepository.delete(comment);
	}
}
