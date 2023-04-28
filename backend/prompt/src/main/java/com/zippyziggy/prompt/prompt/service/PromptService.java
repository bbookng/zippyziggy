package com.zippyziggy.prompt.prompt.service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;

import com.zippyziggy.prompt.prompt.client.MemberClient;
import com.zippyziggy.prompt.prompt.dto.response.MemberResponse;
import com.zippyziggy.prompt.prompt.dto.response.PromptCardResponse;
import com.zippyziggy.prompt.prompt.exception.*;
import com.zippyziggy.prompt.prompt.model.PromptBookmark;
import com.zippyziggy.prompt.prompt.model.PromptLike;
import com.zippyziggy.prompt.prompt.repository.PromptBookmarkRepository;
import com.zippyziggy.prompt.prompt.repository.PromptCommentRepository;
import com.zippyziggy.prompt.prompt.repository.PromptLikeRepository;
import com.zippyziggy.prompt.talk.dto.response.TalkListResponse;
import com.zippyziggy.prompt.talk.repository.TalkRepository;
import com.zippyziggy.prompt.talk.service.TalkService;
import org.springframework.cloud.client.circuitbreaker.CircuitBreaker;
import org.springframework.cloud.client.circuitbreaker.CircuitBreakerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.zippyziggy.prompt.common.aws.AwsS3Uploader;
import com.zippyziggy.prompt.prompt.dto.request.PromptModifyRequest;
import com.zippyziggy.prompt.prompt.dto.request.PromptRequest;
import com.zippyziggy.prompt.prompt.dto.response.PromptDetailResponse;
import com.zippyziggy.prompt.prompt.dto.response.PromptResponse;
import com.zippyziggy.prompt.prompt.model.Prompt;
import com.zippyziggy.prompt.prompt.repository.PromptRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class PromptService{

	private static final String VIEWCOOKIENAME = "alreadyViewCookie";
	private final AwsS3Uploader awsS3Uploader;
	private final MemberClient memberClient;
	private final CircuitBreakerFactory circuitBreakerFactory;
	private final PromptRepository promptRepository;
	private final PromptLikeRepository promptLikeRepository;
	private final PromptBookmarkRepository promptBookmarkRepository;
	private final PromptCommentRepository promptCommentRepository;
	private final TalkService talkService;
	private final TalkRepository talkRepository;

	// Exception 처리 필요
	public PromptResponse createPrompt(PromptRequest data, UUID crntMemberUuid, MultipartFile thumbnail) {

		String thumbnailUrl;

		if (thumbnail == null) {
			thumbnailUrl = "default thumbnail image";
		} else {
			thumbnailUrl = awsS3Uploader.upload(thumbnail, "thumbnails");
		}

		Prompt prompt = Prompt.from(data, crntMemberUuid, thumbnailUrl);

		promptRepository.save(prompt);

		return PromptResponse.from(prompt);
	}

	public PromptResponse modifyPrompt(UUID promptUuid, PromptModifyRequest data, UUID crntMemberUuid, MultipartFile thumbnail) {
		Prompt prompt = promptRepository.findByPromptUuid(promptUuid).orElseThrow(PromptNotFoundException::new);

		if (crntMemberUuid != prompt.getMemberUuid()) {
			throw new ForbiddenMemberException();
		}

		// 기존 thumbnail 지우기
		if (thumbnail == null) {
			try {
				awsS3Uploader.delete("thumbnails/", prompt.getThumbnail());
				prompt.setThumbnail("default thumbnail url");
			} catch (RuntimeException e) {
				throw new AwsUploadException("삭제하는데 실패하였습니다.");
			}

		} else {
			awsS3Uploader.delete("thumbnails/", prompt.getThumbnail());
			String thumbnailUrl = awsS3Uploader.upload(thumbnail, "thumbnail");
			prompt.setThumbnail(thumbnailUrl);
		}

		prompt.setTitle(data.getTitle());
		prompt.setDescription(data.getDescription());
		prompt.setCategory(data.getCategory());

		return PromptResponse.from(prompt);
	}

	public int updateHit(UUID promptUuid, HttpServletRequest request, HttpServletResponse response) {

		Long promptId = promptRepository.findByPromptUuid(promptUuid).orElseThrow(PromptNotFoundException::new).getId();
		Cookie[] cookies = request.getCookies();
		boolean checkCookie = false;
		int result = 0;
		if(cookies != null){
			for (Cookie cookie : cookies) {
				// 이미 조회를 한 경우 체크
				if (cookie.getName().equals(VIEWCOOKIENAME+promptId)) checkCookie = true;

			}
			if(!checkCookie){
				Cookie newCookie = createCookieForForNotOverlap(promptId);
				response.addCookie(newCookie);
				result = promptRepository.updateHit(promptId);
			}
		} else {
			Cookie newCookie = createCookieForForNotOverlap(promptId);
			response.addCookie(newCookie);
			result = promptRepository.updateHit(promptId);
		}
		return result;
	}

	/*
	 * 조회수 중복 방지를 위한 쿠키 생성 메소드
	 * @param cookie
	 * @return
	 * */
	private Cookie createCookieForForNotOverlap(Long promptId) {
		Cookie cookie = new Cookie(VIEWCOOKIENAME+promptId, String.valueOf(promptId));
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

	public PromptDetailResponse getPromptDetail(UUID promptUuid, @Nullable String crntMemberUuid) {
		Prompt prompt = promptRepository.findByPromptUuid(promptUuid).orElseThrow(PromptNotFoundException::new);
		CircuitBreaker circuitBreaker = circuitBreakerFactory.create("circuitBreaker");

		boolean isLiked;
		boolean isBookmarked;

		if (crntMemberUuid.equals("defaultValue")) {
			isLiked = false;
			isBookmarked = false;
		} else {
			isBookmarked = promptBookmarkRepository.
					findByMemberUuidAndPrompt(UUID.fromString(crntMemberUuid), prompt) != null
					? true : false;
			isLiked =  promptLikeRepository.
					findByPromptAndMemberUuid(prompt, UUID.fromString(crntMemberUuid)) != null
					? true : false;
		}

		PromptDetailResponse promptDetailResponse = prompt.toDetailResponse(isLiked, isBookmarked);

		MemberResponse writerInfo = circuitBreaker.run(() -> memberClient.getMemberInfo(prompt.getMemberUuid())
				.orElseThrow(MemberNotFoundException::new));

		promptDetailResponse.setWriterResponse(writerInfo.toWriterResponse());

		// 원본 id가 현재 프롬프트 아이디와 같지 않으면 포크된 프롬프트
		if (prompt.isForked()) {
			UUID originalMemberUuid = promptRepository.findByPromptUuid(prompt.getOriginPromptUuid())
					.orElseThrow(PromptNotFoundException::new).getMemberUuid();

			MemberResponse originalMemberInfo = circuitBreaker.run(() -> memberClient.getMemberInfo(originalMemberUuid)
					.orElseThrow(MemberNotFoundException::new), throwable -> null);

			promptDetailResponse.setOriginerResponse(originalMemberInfo.toOriginerResponse());
		}

		return promptDetailResponse;
	}

	public List<TalkListResponse> getPromptTalkList(UUID promptUuid, String crntMemberUuid) {
		CircuitBreaker circuitBreaker = circuitBreakerFactory.create("circuitBreaker");
		Prompt prompt = promptRepository.findByPromptUuid(promptUuid).orElseThrow(PromptNotFoundException::new);
		return talkService.getTalkListResponses(circuitBreaker, prompt, crntMemberUuid);
	}

    /*
	본인이 작성한 프롬프트인지 확인 필요
	 */

	public void removePrompt(UUID promptUuid, UUID crntMemberUuid) {
		Prompt prompt = promptRepository.findByPromptUuid(promptUuid).orElseThrow(PromptNotFoundException::new);

		if (crntMemberUuid != prompt.getMemberUuid()) {
			throw new ForbiddenMemberException();
		}

		awsS3Uploader.delete("thumbnails/" , prompt.getThumbnail());
		promptRepository.delete(prompt);
	}

    /*
    프롬프트 좋아요 처리
     */

	public void likePrompt(UUID promptUuid, String crntMemberUuid) {

		// 좋아요 상태 추적
		PromptLike promptLikeExist = likePromptExist(promptUuid, crntMemberUuid);

		// 좋아요를 이미 한 상태일 경우
		Prompt prompt = promptRepository.findByPromptUuid(promptUuid).orElseThrow(PromptNotFoundException::new);

		if (promptLikeExist == null) {
			// 프롬프트 조회
			System.out.println("prompt = " + prompt);

			PromptLike promptLike = PromptLike.builder()
					.prompt(prompt)
					.memberUuid(UUID.fromString(crntMemberUuid))
					.regDt(LocalDateTime.now()).build();

			// 프롬프트 - 사용자 좋아요 관계 생성
			promptLikeRepository.save(promptLike);

			// 프롬프트 좋아요 개수 1 증가
			prompt.setLikeCnt(prompt.getLikeCnt() + 1);
			promptRepository.save(prompt);

		} else {

			// 프롬프트 - 사용자 좋아요 취소
			promptLikeRepository.delete(promptLikeExist);

			// 프롬프트 좋아요 개수 1 감소
			prompt.setLikeCnt(prompt.getLikeCnt() - 1);
			promptRepository.save(prompt);
		}
	}

    /*
    로그인한 유저가 프롬프트를 좋아요 했는지 확인하는 로직
    null이 아니면 좋아요를 한 상태, null이면 좋아요를 하지 않은 상태
     */

	private PromptLike likePromptExist(UUID promptUuid, String crntMemberUuid) {
		Prompt prompt = promptRepository.findByPromptUuid(promptUuid).orElseThrow(PromptNotFoundException::new);
		PromptLike promptLike = promptLikeRepository.findByPromptAndMemberUuid(prompt, UUID.fromString(crntMemberUuid));
		if (promptLike != null) {
			return promptLike;
		} else {
			return null;
		}
	}

    /*
    로그인한 유저가 좋아요를 누른 프롬프트 조회하기, PromptCard 타입의 리스트 형식으로 응답
     */
	public List<PromptCardResponse> likePromptsByMember (String crntMemberUuid, Pageable pageable) {
		System.out.println("memberUuid = " + crntMemberUuid);
		System.out.println("pageable = " + pageable);
		CircuitBreaker circuitBreaker = circuitBreakerFactory.create("circuitBreaker");

		MemberResponse writerInfo = circuitBreaker.run(() -> memberClient.getMemberInfo(UUID.fromString(crntMemberUuid)))
				.orElseThrow(MemberNotFoundException::new);

		List<Prompt> prompts = promptLikeRepository.findAllPromptsByMemberUuid(UUID.fromString(crntMemberUuid), pageable);
		List<PromptCardResponse> promptCardResponses = new ArrayList<>();

		for (Prompt prompt: prompts) {
			long commentCnt = promptCommentRepository.findAllByPromptPromptUuid(prompt.getPromptUuid()).size();
			long forkCnt = promptRepository.findAllByOriginPromptUuid(prompt.getPromptUuid()).size();
			long talkCnt = talkRepository.findAllByPromptPromptUuid(prompt.getPromptUuid()).size();

			// 좋아요, 북마크 여부
			Boolean isBookmarked;
			Boolean isOriginLiked;

			if (crntMemberUuid.equals("defaultValue")) {
				isBookmarked = false;
				isOriginLiked = false;
			} else {
				isBookmarked = promptBookmarkRepository.findByMemberUuidAndPrompt(UUID.fromString(crntMemberUuid),prompt) != null
						? true : false;
				isOriginLiked = promptLikeRepository.findByPromptAndMemberUuid(prompt, UUID.fromString(crntMemberUuid)) != null
						? true : false;
			}

			PromptCardResponse promptCardResponse = PromptCardResponse.from(writerInfo, prompt, commentCnt, forkCnt, talkCnt, isBookmarked, isOriginLiked);
			promptCardResponses.add(promptCardResponse);
		}

		return promptCardResponses;
	}


	/*
	북마크 등록 및 삭제
	 */
	public void bookmarkPrompt(UUID promptUuid, String crntMemberUuid) {

		Prompt prompt = promptRepository.findByPromptUuid(promptUuid).orElseThrow(PromptNotFoundException::new);
		PromptBookmark promptBookmark = promptBookmarkRepository.findByMemberUuidAndPrompt(UUID.fromString(crntMemberUuid), prompt);
		if (promptBookmark == null) {
			promptBookmarkRepository.save(PromptBookmark.from(prompt, UUID.fromString(crntMemberUuid)));
		} else {
			promptBookmarkRepository.delete(promptBookmark);
		}
	}


	/*
	북마크 조회하기
	 */
	public List<?> bookmarkPromptByMember(String crntMemberUuid, Pageable pageable) {

		CircuitBreaker circuitBreaker = circuitBreakerFactory.create("circuitBreaker");
		MemberResponse writerInfo = circuitBreaker.run(() -> memberClient.getMemberInfo(UUID.fromString(crntMemberUuid)))
				.orElseThrow(MemberNotFoundException::new);

		List<Prompt> prompts = promptBookmarkRepository.findAllPromptsByMemberUuid(UUID.fromString(crntMemberUuid), pageable);
		List<PromptCardResponse> promptCardResponses = new ArrayList<>();

		for (Prompt prompt : prompts) {
			long commentCnt = promptCommentRepository.findAllByPromptPromptUuid(prompt.getPromptUuid()).size();
			long forkCnt = promptRepository.findAllByOriginPromptUuid(prompt.getPromptUuid()).size();
			long talkCnt = talkRepository.findAllByPromptPromptUuid(prompt.getPromptUuid()).size();

			boolean isBookmarded;
			boolean isLiked;

			if (c)

			promptBookmarkRepository.findByMemberUuidAndPrompt(UUID.fromString(crntMemberUuid), prompt);
			promptLikeRepository.findByPromptAndMemberUuid(prompt, UUID.fromString(crntMemberUuid))

		}


	}



}
