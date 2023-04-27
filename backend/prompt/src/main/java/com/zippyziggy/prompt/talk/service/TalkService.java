package com.zippyziggy.prompt.talk.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import com.zippyziggy.prompt.talk.repository.MessageRepository;
import org.springframework.cloud.client.circuitbreaker.CircuitBreaker;
import org.springframework.cloud.client.circuitbreaker.CircuitBreakerFactory;
import org.springframework.stereotype.Service;

import com.zippyziggy.prompt.prompt.client.MemberClient;
import com.zippyziggy.prompt.prompt.dto.response.MemberResponse;
import com.zippyziggy.prompt.prompt.dto.response.PromptCardResponse;
import com.zippyziggy.prompt.prompt.exception.MemberNotFoundException;
import com.zippyziggy.prompt.prompt.model.Prompt;
import com.zippyziggy.prompt.prompt.repository.PromptBookmarkRepository;
import com.zippyziggy.prompt.prompt.repository.PromptCommentRepository;
import com.zippyziggy.prompt.prompt.repository.PromptLikeRepository;
import com.zippyziggy.prompt.prompt.repository.PromptRepository;
import com.zippyziggy.prompt.talk.dto.request.TalkRequest;
import com.zippyziggy.prompt.talk.dto.response.TalkDetailResponse;
import com.zippyziggy.prompt.talk.dto.response.TalkListResponse;
import com.zippyziggy.prompt.talk.exception.TalkNotFoundException;
import com.zippyziggy.prompt.talk.model.Message;
import com.zippyziggy.prompt.talk.model.Talk;
import com.zippyziggy.prompt.talk.repository.TalkLikeRepository;
import com.zippyziggy.prompt.talk.repository.TalkRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class TalkService {

	private final TalkRepository talkRepository;
	private final TalkLikeRepository talkLikeRepository;
	private final CircuitBreakerFactory circuitBreakerFactory;
	private final MemberClient memberClient;
	private final PromptRepository promptRepository;
	private final PromptCommentRepository promptCommentRepository;
	private final PromptBookmarkRepository promptBookmarkRepository;
	private final PromptLikeRepository promptLikeRepository;
	private final MessageRepository messageRepository;

	// 은지가 짤거임
	public List<TalkListResponse> getTalkList() {
		talkRepository.findAll();
		return null;
	}

	// promptUuid가 있는지 없는지에 따라 -> 프롬프트 활용 or 그냥 대화
	public TalkDetailResponse createTalk(TalkRequest data, UUID crntMemberUuid) {
		Talk talk = Talk.from(data, crntMemberUuid);
		talkRepository.save(talk);
		List<Message> messageList = data.getMessages().stream().map(message -> Message.from(message, talk)).collect(
				Collectors.toList());
		talk.setMessages(messageList);
		return null;
	}

	// originMember, originPrompt, talkList 추가
	public TalkDetailResponse getTalkDetail(Long talkId, UUID crntMemberUuid) {
		CircuitBreaker circuitBreaker = circuitBreakerFactory.create("circuitBreaker");
		Talk talk = talkRepository.findById(talkId).orElseThrow(TalkNotFoundException::new);

		Long likeCnt = talkLikeRepository.countAllByTalkId(talkId);
		boolean isLiked;

		if (crntMemberUuid.equals("defaultValue")) {
			isLiked = false;
		} else {
			isLiked = talkLikeRepository.findByIdAndMemberUuid(talkId, crntMemberUuid) != null ? true : false;
		}

		MemberResponse writerInfo = circuitBreaker.run(() -> memberClient.getMemberInfo(talk.getMemberUUid())
				.orElseThrow(MemberNotFoundException::new));

		if (talk.getPrompt() != null) {
			Prompt originPrompt = talk.getPrompt();

			MemberResponse originMember = circuitBreaker.run(() -> memberClient.getMemberInfo(originPrompt.getMemberUuid())
					.orElseThrow(MemberNotFoundException::new));

			long commentCnt = promptCommentRepository.findAllByPromptPromptUuid(originPrompt.getPromptUuid()).size();
			long forkCnt = promptRepository.findAllByOriginPromptUuid(originPrompt.getPromptUuid()).size();
			long talkCnt = talkRepository.findAllByPromptPromptUuid(originPrompt.getPromptUuid()).size();

			// 좋아요, 북마크 여부
			boolean isOriginLiked;
			boolean isBookmarked;

			// 현재 로그인된 사용자가 아니면 기본값 false
			if (crntMemberUuid == null) {
				isBookmarked = false;
				isOriginLiked = false;
			} else {
				isBookmarked = promptBookmarkRepository.findByMemberUuidAndPrompt(crntMemberUuid, originPrompt) != null
						? true : false;
				isOriginLiked =  promptLikeRepository.countAllByMemberUuidAndPrompt(crntMemberUuid, originPrompt) != null
						? true : false;
			}

			PromptCardResponse promptCardResponse = PromptCardResponse
					.from(originMember, originPrompt, commentCnt, forkCnt, talkCnt, isBookmarked, isOriginLiked);

			talkRepository.findAllByPromptPromptUuid(originPrompt.getPromptUuid());


		}


		return talk.toDetailResponse(isLiked, likeCnt, writerInfo);

	}
}
