package com.zippyziggy.prompt.talk.service;

import com.zippyziggy.prompt.common.kafka.KafkaProducer;
import com.zippyziggy.prompt.prompt.client.MemberClient;
import com.zippyziggy.prompt.prompt.dto.request.TalkCntRequest;
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
import com.zippyziggy.prompt.talk.exception.TalkLikeNotFoundException;
import com.zippyziggy.prompt.talk.exception.TalkNotFoundException;
import com.zippyziggy.prompt.talk.model.Message;
import com.zippyziggy.prompt.talk.model.Role;
import com.zippyziggy.prompt.talk.model.Talk;
import com.zippyziggy.prompt.talk.model.TalkLike;
import com.zippyziggy.prompt.talk.repository.MessageRepository;
import com.zippyziggy.prompt.talk.repository.TalkCommentRepository;
import com.zippyziggy.prompt.talk.repository.TalkLikeRepository;
import com.zippyziggy.prompt.talk.repository.TalkRepository;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.cloud.client.circuitbreaker.CircuitBreaker;
import org.springframework.cloud.client.circuitbreaker.CircuitBreakerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

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
	private final KafkaProducer kafkaProducer;

	private static final String VIEWCOOKIENAME = "alreadyViewCookie";

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

		// 생성 시 search 서비스에 Elasticsearch INSERT 요청
		kafkaProducer.sendTalkCreateMessage("create-talk-topic", talk.toEsTalkRequest());

		return talk.toTalkResponse();
	}

	public TalkDetailResponse getTalkDetail(Long talkId, String crntMemberUuid, Pageable pageable) {

		Talk talk = talkRepository.findById(talkId).orElseThrow(TalkNotFoundException::new);

		Long likeCnt = talkLikeRepository.countAllByTalkId(talkId);
		boolean isLiked;

		if (crntMemberUuid.equals("defaultValue")) {
			isLiked = false;
		} else {
			isLiked = talkLikeRepository.existsByTalk_IdAndMemberUuid(talkId, UUID.fromString(crntMemberUuid));
		}

		CircuitBreaker circuitBreaker = circuitBreakerFactory.create("circuitBreaker");

		MemberResponse writerInfo = circuitBreaker.run(() -> memberClient.getMemberInfo(talk.getMemberUuid())
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
						.findByTalk_IdAndMemberUuid(t.getId(), UUID.fromString(crntMemberUuid)) != null ? true : false;
			}
			Long talkLikeCnt = talkLikeRepository.countAllByTalkId(t.getId());
			Long talkCommentCnt = talkCommentRepository.countAllByTalk_Id(t.getId());
			String question = messageRepository.findFirstByTalkIdAndRole(t.getId(), Role.USER).getContent().toString();
			String answer = messageRepository.findFirstByTalkIdAndRole(t.getId(), Role.ASSISTANT).getContent().toString();
			MemberResponse talkMemberInfo = circuitBreaker.run(() -> memberClient.getMemberInfo(t.getMemberUuid())
					.orElseThrow(MemberNotFoundException::new));

			return TalkListResponse.from(
				t.getId(),
				t.getTitle(),
				question,
				answer,
				talkMemberInfo.getProfileImg(),
				talkMemberInfo.getNickname(),
				talkLikeCnt,
				talkCommentCnt,
				isTalkLiked);

		}).collect(Collectors.toList());
		return talkListResponses;
	}

	public void removeTalk(UUID crntMemberUuid, Long talkId) {
		final Talk talk = talkRepository.findById(talkId)
				.orElseThrow(TalkNotFoundException::new);

		if (!crntMemberUuid.equals(talk.getMemberUuid())) {
			throw new ForbiddenMemberException();
		}

		// 삭제 시 search 서비스에 Elasticsearch DELETE 요청
		kafkaProducer.sendTalkDeleteMessage("delete-talk-topic", talk.getId());

		talkRepository.delete(talk);
	}

	public void likeTalk(Long talkId, UUID crntMemberUuid) {
		final Talk talk = talkRepository.findById(talkId)
				.orElseThrow(TalkNotFoundException::new);
		final TalkLike talkLike = TalkLike.from(talk, crntMemberUuid);

		talkLikeRepository.findByTalk_IdAndMemberUuid(talkId, crntMemberUuid)
				.orElseGet(() -> talkLikeRepository.save(talkLike));

		talk.setLikeCnt(talk.getLikeCnt() + 1);
		talkRepository.save(talk);

		// Elasticsearch에 좋아요 수 반영
		final TalkCntRequest talkCntRequest = new TalkCntRequest(talkId, talk.getLikeCnt());
		kafkaProducer.sendTalkCnt("sync-talk-like-cnt", talkCntRequest);

	}

	public void unlikeTalk(Long talkId, UUID crntMemberUuid) {
		final Talk talk = talkRepository.findById(talkId)
			.orElseThrow(TalkNotFoundException::new);
		final TalkLike oldTalkLike = talkLikeRepository.findByTalk_IdAndMemberUuid(talkId, crntMemberUuid)
				.orElseThrow(TalkLikeNotFoundException::new);

		talkLikeRepository.delete(oldTalkLike);

		talk.setLikeCnt(talk.getLikeCnt() - 1);
		talkRepository.save(talk);

		// Elasticsearch에 좋아요 수 반영
		final TalkCntRequest talkCntRequest = new TalkCntRequest(talkId, talk.getLikeCnt());
		kafkaProducer.sendTalkCnt("sync-talk-like-cnt", talkCntRequest);
	}

    public Long findCommentCnt(Long talkId) {
		return talkCommentRepository.countAllByTalk_Id(talkId);
    }

	public int updateHit(Long talkId, HttpServletRequest request, HttpServletResponse response) {

		final Talk talk = talkRepository.findById(talkId).orElseThrow(TalkNotFoundException::new);

		Cookie[] cookies = request.getCookies();
		boolean checkCookie = false;
		int result = 0;
		if(cookies != null){
			for (Cookie cookie : cookies) {
				// 이미 조회를 한 경우 체크
				if (cookie.getName().equals(VIEWCOOKIENAME+talkId)) checkCookie = true;

			}
			if(!checkCookie){
				Cookie newCookie = createCookieForForNotOverlap(talkId);
				response.addCookie(newCookie);
				result = talkRepository.updateHit(talkId);
			}
		} else {
			Cookie newCookie = createCookieForForNotOverlap(talkId);
			response.addCookie(newCookie);
			result = talkRepository.updateHit(talkId);
		}

		// Elasticsearch에 조회수 반영
		final TalkCntRequest talkCntRequest = new TalkCntRequest(talkId, talk.getHit());
		kafkaProducer.sendTalkCnt("sync-talk-hit", talkCntRequest);

		return result;
	}

	/*
	 * 조회수 중복 방지를 위한 쿠키 생성 메소드
	 * @param cookie
	 * @return
	 * */
	private Cookie createCookieForForNotOverlap(Long talkId) {
		Cookie cookie = new Cookie(VIEWCOOKIENAME+talkId, String.valueOf(talkId));
		cookie.setComment("조회수 중복 증가 방지 쿠키");    // 쿠키 용도 설명 기재
		cookie.setMaxAge(getRemainSecondForTomorrow());     // 하루를 준다.
		cookie.setHttpOnly(true);                // 서버에서만 조작 가능
		return cookie;
	}

	// 다음 날 정각까지 남은 시간(초)
	private int getRemainSecondForTomorrow() {
		LocalDateTime now = LocalDateTime.now();
		LocalDateTime tomorrow = LocalDateTime.now().plusDays(1L).truncatedTo(ChronoUnit.DAYS);
		return (int) now.until(tomorrow, ChronoUnit.SECONDS);
	}
}
