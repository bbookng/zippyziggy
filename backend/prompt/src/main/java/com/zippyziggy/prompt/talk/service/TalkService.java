package com.zippyziggy.prompt.talk.service;

import com.zippyziggy.prompt.prompt.client.MemberClient;
import com.zippyziggy.prompt.prompt.dto.response.MemberResponse;
import com.zippyziggy.prompt.prompt.dto.response.PromptCardResponse;
import com.zippyziggy.prompt.prompt.exception.ForbiddenMemberException;
import com.zippyziggy.prompt.prompt.exception.MemberNotFoundException;
import com.zippyziggy.prompt.prompt.exception.PromptNotFoundException;
import com.zippyziggy.prompt.prompt.model.Prompt;
import com.zippyziggy.prompt.prompt.repository.PromptBookmarkRepository;
import com.zippyziggy.prompt.prompt.repository.PromptCommentRepository;
import com.zippyziggy.prompt.prompt.repository.PromptLikeRepository;
import com.zippyziggy.prompt.prompt.repository.PromptRepository;
import com.zippyziggy.prompt.talk.dto.request.TalkRequest;
import com.zippyziggy.prompt.talk.dto.response.TalkDetailResponse;
import com.zippyziggy.prompt.talk.dto.response.TalkListResponse;
import com.zippyziggy.prompt.talk.dto.response.TalkResponse;
import com.zippyziggy.prompt.talk.exception.TalkNotFoundException;
import com.zippyziggy.prompt.talk.model.Message;
import com.zippyziggy.prompt.talk.model.Role;
import com.zippyziggy.prompt.talk.model.Talk;
import com.zippyziggy.prompt.talk.repository.MessageRepository;
import com.zippyziggy.prompt.talk.repository.TalkCommentRepository;
import com.zippyziggy.prompt.talk.repository.TalkLikeRepository;
import com.zippyziggy.prompt.talk.repository.TalkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cloud.client.circuitbreaker.CircuitBreaker;
import org.springframework.cloud.client.circuitbreaker.CircuitBreakerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

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
	private final TalkCommentRepository talkCommentRepository;

	// 은지가 짤거임, 지금 검색 안됨 그냥 전체 조회
	public List<TalkListResponse> getTalkList(String crntMemberUuid) {
		CircuitBreaker circuitBreaker = circuitBreakerFactory.create("circuitBreaker");
		return getTalks(circuitBreaker, talkRepository.findAll(), crntMemberUuid);
	}

	// promptUuid가 있는지 없는지에 따라 -> 프롬프트 활용 or 그냥 대화
	public TalkResponse createTalk(TalkRequest data, UUID crntMemberUuid) {
		Talk talk = Talk.from(data, crntMemberUuid);
		talkRepository.save(talk);
		List<Message> messageList = data.getMessages().stream().map(message -> Message.from(message, talk)).collect(
				Collectors.toList());
		talk.setMessages(messageList);
		if (data.getPromptUuid() != null) {
			talk.setPrompt(promptRepository.findByPromptUuid(UUID.fromString(data.getPromptUuid()))
					.orElseThrow(PromptNotFoundException::new));
		}
		return talk.toTalkResponse();
	}

	public TalkDetailResponse getTalkDetail(Long talkId, String crntMemberUuid, Pageable pageable) {

		Talk talk = talkRepository.findById(talkId).orElseThrow(TalkNotFoundException::new);

		Long likeCnt = talkLikeRepository.countAllByTalkId(talkId);
		boolean isLiked;

		if (crntMemberUuid.equals("defaultValue")) {
			isLiked = false;
		} else {
			isLiked = talkLikeRepository
					.findByIdAndMemberUuid(talkId, UUID.fromString(crntMemberUuid)) != null ? true : false;
		}

		CircuitBreaker circuitBreaker = circuitBreakerFactory.create("circuitBreaker");

		MemberResponse writerInfo = circuitBreaker.run(() -> memberClient.getMemberInfo(talk.getMemberUUid())
				.orElseThrow(MemberNotFoundException::new));

		TalkDetailResponse response = talk.toDetailResponse(isLiked, likeCnt, writerInfo);

		if (talk.getPrompt() != null) {
			Prompt originPrompt = talk.getPrompt();

			MemberResponse originMember = circuitBreaker.run(() -> memberClient
					.getMemberInfo(originPrompt.getMemberUuid())
					.orElseThrow(MemberNotFoundException::new));

			PromptCardResponse promptCardResponse = getPromptCardResponse(crntMemberUuid, originPrompt, originMember);

			List<TalkListResponse> talkListResponses = getTalkListResponses(circuitBreaker, originPrompt, crntMemberUuid, pageable);

			response.setOriginMember(originMember);
			response.setOriginPrompt(promptCardResponse);
			response.setTalkList(talkListResponses);
		}
		return response;

	}

	private PromptCardResponse getPromptCardResponse(String crntMemberUuid, Prompt originPrompt, MemberResponse originMember) {
		long commentCnt = promptCommentRepository.countAllByPromptPromptUuid(originPrompt.getPromptUuid());
		long forkCnt = promptRepository.countAllByOriginPromptUuid(originPrompt.getPromptUuid());
		long talkCnt = talkRepository.countAllByPromptPromptUuid(originPrompt.getPromptUuid());

		// 좋아요, 북마크 여부
		boolean isOriginLiked;
		boolean isBookmarked;

		// 현재 로그인된 사용자가 아니면 기본값 false
		if (crntMemberUuid.equals("defaultValue")) {
			isBookmarked = false;
			isOriginLiked = false;
		} else {
			isBookmarked = promptBookmarkRepository
					.findByMemberUuidAndPrompt(UUID.fromString(crntMemberUuid), originPrompt) != null
					? true : false;
			isOriginLiked =  promptLikeRepository
					.findByPromptAndMemberUuid(originPrompt, UUID.fromString(crntMemberUuid)) != null
					? true : false;
		}

		PromptCardResponse promptCardResponse = PromptCardResponse
				.from(originMember, originPrompt, commentCnt, forkCnt, talkCnt, isBookmarked, isOriginLiked);
		return promptCardResponse;
	}

	public List<TalkListResponse> getTalkListResponses(CircuitBreaker circuitBreaker, Prompt originPrompt, String crntMemberUuid, Pageable pageable) {

		List<Talk> talks = talkRepository.findAllByPromptPromptUuid(originPrompt.getPromptUuid(), pageable).toList();

		List<TalkListResponse> talkListResponses = getTalks(circuitBreaker, talks, crntMemberUuid);

		return talkListResponses;
	}

	public List<TalkListResponse> getTalks(CircuitBreaker circuitBreaker, List<Talk> talks, String crntMemberUuid) {
		List<TalkListResponse> talkListResponses = talks.stream().map(t -> {

			boolean isTalkLiked;

			if (crntMemberUuid.equals("defaultValue")) {
				isTalkLiked = false;
			} else {
				isTalkLiked = talkLikeRepository
						.findByIdAndMemberUuid(t.getId(), UUID.fromString(crntMemberUuid)) != null ? true : false;
			}
			Long talkLikeCnt = talkLikeRepository.countAllByTalkId(t.getId());
			Long talkCommentCnt = talkCommentRepository.countAllByTalk_Id(t.getId());
			String question = messageRepository.findFirstByTalkIdAndRole(t.getId(), Role.USER).getContent().toString();
			String answer = messageRepository.findFirstByTalkIdAndRole(t.getId(), Role.ASSISTANT).getContent().toString();
			MemberResponse talkMemberInfo = circuitBreaker.run(() -> memberClient.getMemberInfo(t.getMemberUUid())
					.orElseThrow(MemberNotFoundException::new));

			return TalkListResponse.from(question, answer,
					talkMemberInfo.getProfileImg(), talkMemberInfo.getNickname(),
					talkLikeCnt, talkCommentCnt,
					isTalkLiked);

		}).collect(Collectors.toList());
		return talkListResponses;
	}

	public void removeTalk(UUID crntMemberUuid, Long talkId) {
		final Talk talk = talkRepository.findById(talkId)
				.orElseThrow(TalkNotFoundException::new);

		if (!crntMemberUuid.equals(talk.getMemberUUid())) {
			throw new ForbiddenMemberException();
		}

		//TODO 삭제 시 search 서비스에 Elasticsearch DELETE 요청

		talkRepository.delete(talk);
	}
}
