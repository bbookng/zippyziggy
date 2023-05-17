package com.zippyziggy.prompt.prompt.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.zippyziggy.prompt.common.aws.AwsS3Uploader;
import com.zippyziggy.prompt.common.kafka.KafkaProducer;
import com.zippyziggy.prompt.prompt.client.MemberClient;
import com.zippyziggy.prompt.prompt.dto.request.AppChatGptRequest;
import com.zippyziggy.prompt.prompt.dto.request.ChatGptMessage;
import com.zippyziggy.prompt.prompt.dto.request.ChatGptRequest;
import com.zippyziggy.prompt.prompt.dto.request.GptApiRequest;
import com.zippyziggy.prompt.prompt.dto.request.NoticeRequest;
import com.zippyziggy.prompt.prompt.dto.request.PromptCntRequest;
import com.zippyziggy.prompt.prompt.dto.request.PromptRatingRequest;
import com.zippyziggy.prompt.prompt.dto.request.PromptReportRequest;
import com.zippyziggy.prompt.prompt.dto.request.PromptRequest;
import com.zippyziggy.prompt.prompt.dto.response.*;
import com.zippyziggy.prompt.prompt.exception.AwsUploadException;
import com.zippyziggy.prompt.prompt.exception.ForbiddenMemberException;
import com.zippyziggy.prompt.prompt.exception.PromptNotFoundException;
import com.zippyziggy.prompt.prompt.exception.RatingAlreadyExistException;
import com.zippyziggy.prompt.prompt.exception.ReportAlreadyExistException;
import com.zippyziggy.prompt.prompt.model.*;
import com.zippyziggy.prompt.prompt.repository.PromptBookmarkRepository;
import com.zippyziggy.prompt.prompt.repository.PromptClickRepository;
import com.zippyziggy.prompt.prompt.repository.PromptCommentRepository;
import com.zippyziggy.prompt.prompt.repository.PromptLikeRepository;
import com.zippyziggy.prompt.prompt.repository.PromptReportRepository;
import com.zippyziggy.prompt.prompt.repository.PromptRepository;
import com.zippyziggy.prompt.prompt.repository.RatingRepository;
import com.zippyziggy.prompt.prompt.util.RedisUtils;
import com.zippyziggy.prompt.recommender.service.RecommenderService;
import com.zippyziggy.prompt.talk.dto.response.PromptTalkListResponse;
import com.zippyziggy.prompt.talk.dto.response.TalkListResponse;
import com.zippyziggy.prompt.talk.repository.TalkRepository;
import com.zippyziggy.prompt.talk.service.TalkService;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cloud.client.circuitbreaker.CircuitBreaker;
import org.springframework.cloud.client.circuitbreaker.CircuitBreakerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class PromptService{

	private static final String VIEWCOOKIENAME = "alreadyViewCookie";
	private static final String MODEL = "gpt-3.5-turbo";
	private static final String URL = "https://api.openai.com/v1/chat/completions";

	private final AwsS3Uploader awsS3Uploader;
	private final MemberClient memberClient;
	private final CircuitBreakerFactory circuitBreakerFactory;

	private final PromptRepository promptRepository;
	private final PromptLikeRepository promptLikeRepository;
	private final PromptBookmarkRepository promptBookmarkRepository;
	private final PromptCommentRepository promptCommentRepository;
	private final TalkRepository talkRepository;
	private final RatingRepository ratingRepository;
	private final PromptReportRepository promptReportRepository;
	private final PromptClickRepository promptClickRepository;

	private final TalkService talkService;
	private final RecommenderService recommenderService;

	private final KafkaProducer kafkaProducer;

	private final RedisUtils redisUtils;
	private final RedisTemplate redisTemplate;
	private final ObjectMapper objectMapper;

	@Qualifier("openaiRestTemplate")
	@Autowired
	private RestTemplate restTemplate;

	// Exception 처리 필요
	public PromptResponse createPrompt(PromptRequest data, UUID crntMemberUuid, @Nullable MultipartFile thumbnail) {
		log.info("thumnbnail -> ", thumbnail);

		String thumbnailUrl;

		if (thumbnail == null) {
			thumbnailUrl = "https://zippyziggy.s3.ap-northeast-2.amazonaws.com/default/noCardImg.png";
		} else {
			thumbnailUrl = awsS3Uploader.upload(thumbnail, "thumbnails");
		}

		Prompt prompt = Prompt.from(data, crntMemberUuid, thumbnailUrl);

		promptRepository.save(prompt);

		// 생성 시 search 서비스에 Elasticsearch INSERT 요청
		kafkaProducer.send("create-prompt-topic", prompt.toEsPromptRequest());

		return PromptResponse.from(prompt);
	}

	public PromptResponse modifyPrompt(UUID promptUuid, PromptRequest data, UUID crntMemberUuid, @Nullable MultipartFile thumbnail) {
		Prompt prompt = promptRepository
				.findByPromptUuidAndStatusCode(promptUuid, StatusCode.OPEN)
				.orElseThrow(PromptNotFoundException::new);

		if (!crntMemberUuid.equals(prompt.getMemberUuid())) {
			throw new ForbiddenMemberException();
		}

		// 기존 thumbnail 지우기
		if (thumbnail == null) {
			try {
				awsS3Uploader.delete("thumbnails/", prompt.getThumbnail());
			} catch (RuntimeException e) {
				throw new AwsUploadException("삭제하는데 실패하였습니다.");
			}
			prompt.setThumbnail("https://zippyziggy.s3.ap-northeast-2.amazonaws.com/default/noCardImg.png");

		} else {
			awsS3Uploader.delete("thumbnails/", prompt.getThumbnail());
			String thumbnailUrl = awsS3Uploader.upload(thumbnail, "thumbnail");
			prompt.setThumbnail(thumbnailUrl);
		}

		prompt.setTitle(data.getTitle());
		prompt.setDescription(data.getDescription());
		prompt.setCategory(data.getCategory());
		prompt.setUpdDt(LocalDateTime.now());
		prompt.setPrefix(data.getMessage().getPrefix());
		prompt.setExample(data.getMessage().getExample());
		prompt.setSuffix(data.getMessage().getSuffix());

		// 수정 시 search 서비스에 Elasticsearch UPDATE 요청
		kafkaProducer.send("update-prompt-topic", prompt.toEsPromptRequest());

		return PromptResponse.from(prompt);
	}

	public int updateHit(UUID promptUuid, HttpServletRequest request, HttpServletResponse response) {

		Prompt prompt = promptRepository
				.findByPromptUuidAndStatusCode(promptUuid, StatusCode.OPEN)
				.orElseThrow(PromptNotFoundException::new);
		Long promptId = prompt.getId();

		Cookie[] cookies = request.getCookies();
		log.info("cookie -> : " + cookies);
		boolean checkCookie = false;
		int result = 0;
		if(cookies != null){
			for (Cookie cookie : cookies) {
				log.info("cookie.getName " + cookie.getName());
				log.info("cookie.getValue " + cookie.getValue());

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

		// Elasticsearch에 조회수 반영
		PromptCntRequest promptCntRequest = prompt.toPromptHitRequest();
		kafkaProducer.sendPromptCnt("sync-prompt-hit", promptCntRequest);

		return result;
	}

	/*
	 * 조회수 중복 방지를 위한 쿠키 생성 메소드
	 * @param cookie
	 * @return
	 * */
	private Cookie createCookieForForNotOverlap(Long promptId) {
		Cookie cookie = new Cookie(VIEWCOOKIENAME+ promptId, String.valueOf(promptId));
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
		Prompt prompt = promptRepository
				.findByPromptUuidAndStatusCode(promptUuid, StatusCode.OPEN)
				.orElseThrow(PromptNotFoundException::new);
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

		MemberResponse writerInfo = circuitBreaker.run(() -> memberClient.getMemberInfo(prompt.getMemberUuid()));

		promptDetailResponse.setWriter(writerInfo.toWriterResponse());

		// 원본 id가 현재 프롬프트 아이디와 같지 않으면 포크된 프롬프트
		if (prompt.isForked()) {
			UUID originPromptUuid = prompt.getOriginPromptUuid();
			UUID originalMemberUuid = promptRepository.findByPromptUuid(originPromptUuid).orElseThrow(PromptNotFoundException::new).getMemberUuid();

			MemberResponse originalMemberInfo = circuitBreaker.run(() -> memberClient.getMemberInfo(originalMemberUuid));

			promptDetailResponse.setOriginer(originalMemberInfo.toOriginerResponse());
			promptDetailResponse.setOriginPromptUuid(originPromptUuid);
			promptDetailResponse.setOriginPromptTitle(promptRepository
					.findByPromptUuid(originPromptUuid)
					.orElseThrow(PromptNotFoundException::new)
					.getTitle());
		}

		if (!crntMemberUuid.equals("defaultValue")) {

			// 레디스 저장 로직
			String key = "RecentPrompt" + crntMemberUuid;
			Long id = prompt.getId();
			// sorted set으로 저장
			redisTemplate.opsForZSet().add(key, id, System.nanoTime());
			redisTemplate.opsForZSet().removeRange(key, 0, -11);
			redisUtils.setExpireTime(key, 60 * 60 * 24 * 7);

			PromptClick promptClick = PromptClick.builder()
					.prompt(prompt)
					.memberUuid(UUID.fromString(crntMemberUuid))
					.regDt(LocalDateTime.now())
					.build();

			promptClickRepository.save(promptClick);
		}

		return promptDetailResponse;
	}


	public PromptTalkListResponse getPromptTalkList(UUID promptUuid, String crntMemberUuid, Pageable pageable) {
		CircuitBreaker circuitBreaker = circuitBreakerFactory.create("circuitBreaker");
		Prompt prompt = promptRepository
				.findByPromptUuidAndStatusCode(promptUuid, StatusCode.OPEN)
				.orElseThrow(PromptNotFoundException::new);
		List<TalkListResponse> talkListResponses = talkService.getTalkListResponses(circuitBreaker, prompt,
				crntMemberUuid, pageable);
		return new PromptTalkListResponse(talkListResponses.size(), talkListResponses);
	}

    /*
	본인이 작성한 프롬프트인지 확인 필요
	 */

	public void removePrompt(String promptUuid, UUID crntMemberUuid) {
		Prompt prompt = promptRepository
				.findByPromptUuidAndStatusCode(UUID.fromString(promptUuid), StatusCode.OPEN)
				.orElseThrow(PromptNotFoundException::new);

		if (!crntMemberUuid.equals(prompt.getMemberUuid())) {
			throw new ForbiddenMemberException();
		}

		awsS3Uploader.delete("thumbnails/", prompt.getThumbnail());
		prompt.setThumbnail(null);
		prompt.setStatusCode(StatusCode.DELETED);
		promptRepository.save(prompt);

		// 삭제 시 search 서비스에 Elasticsearch DELETE 요청
		kafkaProducer.sendDeleteMessage("delete-prompt-topic", promptUuid);
	}

    /*
    프롬프트 좋아요 처리
     */

	public void likePrompt(UUID promptUuid, String crntMemberUuid) {

		// 좋아요 상태 추적
		PromptLike promptLikeExist = likePromptExist(promptUuid, crntMemberUuid);

		// 좋아요를 이미 한 상태일 경우
		Prompt prompt = promptRepository
				.findByPromptUuidAndStatusCode(promptUuid, StatusCode.OPEN)
				.orElseThrow(PromptNotFoundException::new);

		if (promptLikeExist == null) {
			// 프롬프트 조회

			PromptLike promptLike = PromptLike.builder()
					.prompt(prompt)
					.memberUuid(UUID.fromString(crntMemberUuid))
					.regDt(LocalDateTime.now()).build();

			// 프롬프트 - 사용자 좋아요 관계 생성
			promptLikeRepository.save(promptLike);

			// 프롬프트 좋아요 개수 1 증가
			prompt.setLikeCnt(prompt.getLikeCnt() + 1);
			promptRepository.save(prompt);

			kafkaProducer.sendNotification("send-notification",
					new NoticeRequest(prompt.getMemberUuid().toString(),
							"'" + prompt.getTitle() + "'" + "게시물 좋아요 + 1",
							"https://zippyziggy.kr/prompts/" + prompt.getPromptUuid().toString()));

		} else {

			// 프롬프트 - 사용자 좋아요 취소
			promptLikeRepository.delete(promptLikeExist);

			// 프롬프트 좋아요 개수 1 감소
			prompt.setLikeCnt(prompt.getLikeCnt() - 1);
			promptRepository.save(prompt);
		}

		// Elasticsearch에 좋아요 수 반영
		PromptCntRequest promptCntRequest = prompt.toPromptLikeCntRequest();
		kafkaProducer.sendPromptCnt("sync-prompt-like-cnt", promptCntRequest);
	}

    /*
    로그인한 유저가 프롬프트를 좋아요 했는지 확인하는 로직
    null이 아니면 좋아요를 한 상태, null이면 좋아요를 하지 않은 상태
     */

	private PromptLike likePromptExist(UUID promptUuid, String crntMemberUuid) {
		Prompt prompt = promptRepository
				.findByPromptUuidAndStatusCode(promptUuid, StatusCode.OPEN)
				.orElseThrow(PromptNotFoundException::new);
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
	public PromptCardListResponse likePromptsByMember (String crntMemberUuid, Pageable pageable) {
		CircuitBreaker circuitBreaker = circuitBreakerFactory.create("circuitBreaker");

		Page<Prompt> prompts = promptLikeRepository.findAllPromptsByMemberUuid(UUID.fromString(crntMemberUuid), pageable);
		long totalPromptsCnt = prompts.getTotalElements();
		int totalPageCnt = prompts.getTotalPages();
		List<PromptCardResponse> promptCardResponses = new ArrayList<>();

		for (Prompt prompt: prompts) {
			long commentCnt = promptCommentRepository.countAllByPromptPromptUuid(prompt.getPromptUuid());
			long forkCnt = promptRepository.countAllByOriginPromptUuidAndStatusCode(prompt.getPromptUuid(), StatusCode.OPEN);
			long talkCnt = talkRepository.countAllByPromptPromptUuid(prompt.getPromptUuid());

			MemberResponse writerInfo = circuitBreaker.run(() -> memberClient.getMemberInfo(prompt.getMemberUuid()));

			// 좋아요, 북마크 여부
			boolean isBookmarked = promptBookmarkRepository.findByMemberUuidAndPrompt(UUID.fromString(crntMemberUuid),prompt) != null
					? true : false;
			boolean isOriginLiked = promptLikeRepository.findByPromptAndMemberUuid(prompt, UUID.fromString(crntMemberUuid)) != null
					? true : false;

			PromptCardResponse promptCardResponse = PromptCardResponse.from(writerInfo, prompt, commentCnt, forkCnt, talkCnt, isBookmarked, isOriginLiked);
			promptCardResponses.add(promptCardResponse);
		}

		return PromptCardListResponse.from(totalPromptsCnt, totalPageCnt, promptCardResponses);

	}


	/*
    북마크 등록 및 삭제
     */
	public void bookmarkPrompt(UUID promptUuid, String crntMemberUuid) {

		Prompt prompt = promptRepository
				.findByPromptUuidAndStatusCode(promptUuid, StatusCode.OPEN)
				.orElseThrow(PromptNotFoundException::new);
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
	public PromptCardListResponse bookmarkPromptByMember(String crntMemberUuid, Pageable pageable) {
		log.info(String.valueOf(pageable.getSort()));
		CircuitBreaker circuitBreaker = circuitBreakerFactory.create("circuitBreaker");

		Page<Prompt> prompts = promptBookmarkRepository.findAllPromptsByMemberUuid(UUID.fromString(crntMemberUuid), pageable);
		long totalPromptsCnt = prompts.getTotalElements();
		int totalPageCnt = prompts.getTotalPages();


		List<PromptCardResponse> promptCardResponses = new ArrayList<>();

		for (Prompt prompt : prompts) {
			long commentCnt = promptCommentRepository.countAllByPromptPromptUuid(prompt.getPromptUuid());
			long forkCnt = promptRepository.countAllByOriginPromptUuidAndStatusCode(prompt.getPromptUuid(), StatusCode.OPEN);
			long talkCnt = talkRepository.countAllByPromptPromptUuid(prompt.getPromptUuid());

			MemberResponse writerInfo = circuitBreaker.run(() -> memberClient.getMemberInfo(prompt.getMemberUuid()));

			boolean isBookmarked = promptBookmarkRepository.findByMemberUuidAndPrompt(UUID.fromString(crntMemberUuid), prompt) != null
					? true : false;
			boolean isLiked = promptLikeRepository.findByPromptAndMemberUuid(prompt, UUID.fromString(crntMemberUuid)) != null
					? true : false;

			PromptCardResponse promptCardResponse = PromptCardResponse.from(writerInfo, prompt, commentCnt, forkCnt, talkCnt, isBookmarked, isLiked);
			promptCardResponses.add(promptCardResponse);

		}
		return PromptCardListResponse.from(totalPromptsCnt, totalPageCnt, promptCardResponses);
	}

	/*
    북마크 조회하기(extension)
     */
	public PromptCardListExtensionResponse bookmarkPromptByMemberAndExtension(String crntMemberUuid, Pageable pageable) {
		log.info(String.valueOf(pageable.getSort()));
		CircuitBreaker circuitBreaker = circuitBreakerFactory.create("circuitBreaker");

		Page<Prompt> prompts = promptBookmarkRepository.findAllPromptsByMemberUuid(UUID.fromString(crntMemberUuid), pageable);
		long totalPromptsCnt = prompts.getTotalElements();
		int totalPageCnt = prompts.getTotalPages();


		List<PromptBookmarkResponse> promptBookmarkResponses = new ArrayList<>();

		for (Prompt prompt : prompts) {
			long commentCnt = promptCommentRepository.countAllByPromptPromptUuid(prompt.getPromptUuid());
			long forkCnt = promptRepository.countAllByOriginPromptUuidAndStatusCode(prompt.getPromptUuid(), StatusCode.OPEN);
			long talkCnt = talkRepository.countAllByPromptPromptUuid(prompt.getPromptUuid());

			MemberResponse writerInfo = circuitBreaker.run(() -> memberClient.getMemberInfo(prompt.getMemberUuid()));

			boolean isBookmarked = promptBookmarkRepository.findByMemberUuidAndPrompt(UUID.fromString(crntMemberUuid), prompt) != null
					? true : false;
			boolean isLiked = promptLikeRepository.findByPromptAndMemberUuid(prompt, UUID.fromString(crntMemberUuid)) != null
					? true : false;

			PromptBookmarkResponse promptCardResponse = PromptBookmarkResponse.from(writerInfo, prompt, commentCnt, forkCnt, talkCnt, isBookmarked, isLiked);
			promptBookmarkResponses.add(promptCardResponse);

		}

		return PromptCardListExtensionResponse.from(totalPromptsCnt, totalPageCnt, promptBookmarkResponses);

	}


	/*
    프롬프트 평가
     */
	public void ratingPrompt(UUID promptUuid, String crntMemberUuid, PromptRatingRequest promptRatingRequest) throws Exception {
		Rating ratingExist = ratingRepository.findByMemberUuidAndPromptPromptUuid(UUID.fromString(crntMemberUuid), promptUuid);

		if (ratingExist == null) {
			Prompt prompt = promptRepository
					.findByPromptUuidAndStatusCode(promptUuid, StatusCode.OPEN)
					.orElseThrow(PromptNotFoundException::new);
			Rating rating = Rating.from(UUID.fromString(crntMemberUuid), prompt, promptRatingRequest.getScore());
			ratingRepository.save(rating);
		} else {
			throw new RatingAlreadyExistException();
		}
	}

	/*
    프롬프트 톡 및 댓글 개수 조회
     */
	public SearchPromptResponse searchPrompt(UUID promptUuid, String crntMemberUuid) {

		final Prompt prompt = promptRepository
				.findByPromptUuid(promptUuid)
				.orElseThrow(PromptNotFoundException::new);

		long talkCnt = talkRepository.countAllByPromptPromptUuid(promptUuid);
		long commentCnt = promptCommentRepository
				.countAllByPromptPromptUuid(promptUuid);

		boolean isLiked;
		boolean isBookmarked;
		if (crntMemberUuid.equals("defaultValue")) {
			isLiked = false;
			isBookmarked = false;
		} else {
			UUID memberUuid = UUID.fromString(crntMemberUuid);
			isLiked = promptLikeRepository
					.existsByMemberUuidAndPrompt_PromptUuid(memberUuid, promptUuid);
			isBookmarked = promptBookmarkRepository
					.existsByMemberUuidAndPrompt_PromptUuid(memberUuid, promptUuid);
		}

		return SearchPromptResponse.from(prompt, talkCnt, commentCnt, isLiked, isBookmarked);
	}

	/*
    프롬프트 신고 접수 한 프롬프트 당 5개까지 작성가능
     */
	public void promptReport(UUID promptUuid, String crntMemberUuid, PromptReportRequest promptReportRequest) throws Exception {
		Long reportCnt = promptReportRepository.countAllByMemberUuidAndPrompt_PromptUuid(UUID.fromString(crntMemberUuid), promptUuid);
		if (reportCnt <= 5 ) {
			Prompt prompt = promptRepository
					.findByPromptUuidAndStatusCode(promptUuid, StatusCode.OPEN)
					.orElseThrow(PromptNotFoundException::new);
			PromptReport promptReport = PromptReport.from(UUID.fromString(crntMemberUuid), prompt, promptReportRequest.getContent());
			promptReportRepository.save(promptReport);

			kafkaProducer.sendNotification("send-notification",
					new NoticeRequest(prompt.getMemberUuid().toString(),
							"'" + prompt.getTitle() + "'" + "게시물이 신고되었습니다.",
							"zippyziggy.kr/prompts/" + prompt.getPromptUuid().toString()));


		} else {
			throw new ReportAlreadyExistException();
		}
	}

	/*
    프롬프트 신고 내용 확인
     */
	public Page<PromptReportResponse> reports(Pageable pageable) {
		Page<PromptReport> reports = promptReportRepository.findAllByOrderByRegDtDesc(pageable);
		Page<PromptReportResponse> promptReportResponse = PromptReportResponse.from(reports);
		return promptReportResponse;
	}

	/*
    최근 조회한 프롬프트 10개 조회
     */
	public List<PromptCardResponse> recentPrompts(String crntMemberUuid) {
		if (crntMemberUuid.equals("defaultValue")) {
			return null;
		} else {

			String key = "RecentPrompt" + crntMemberUuid;

			if (redisUtils.isExists(key)) {
				log.info("redis 최근 프롬프트 조회");
				CircuitBreaker circuitBreaker = circuitBreakerFactory.create("circuitBreaker");
				Set<ZSetOperations.TypedTuple<Integer>> set = redisTemplate.opsForZSet().reverseRangeWithScores(key, 0, -1);
				log.info("ZsetOperation = " + set);
				List<Long> promptIds = new ArrayList<>();

				for (ZSetOperations.TypedTuple<Integer> tuple : set) {
					log.info("tupe = >>>> " + tuple);
					log.info("tupe = >>>> " + tuple.getValue());
					Integer temp = tuple.getValue();
					log.info("정수를 롱타입으로" + temp);
					Long value = Long.valueOf(tuple.getValue());
					log.info("롱타입 그대로" + value);
					promptIds.add(value);
				}
				log.info("promptIds = " + promptIds);
				List<Prompt> prompts = new ArrayList<>();

				for (Long promptId: promptIds) {
					Prompt prompt = promptRepository.findById(promptId).get();
					prompts.add(prompt);
				}

				List<PromptCardResponse> promptCardResponses = new ArrayList<>();

				for (Prompt prompt : prompts) {
					long commentCnt = promptCommentRepository.countAllByPromptPromptUuid(prompt.getPromptUuid());
					long forkCnt = promptRepository.countAllByOriginPromptUuidAndStatusCode(prompt.getPromptUuid(), StatusCode.OPEN);
					long talkCnt = talkRepository.countAllByPromptPromptUuid(prompt.getPromptUuid());

					MemberResponse writerInfo = circuitBreaker.run(() -> memberClient.getMemberInfo(prompt.getMemberUuid()));

					boolean isBookmarked = promptBookmarkRepository.findByMemberUuidAndPrompt(UUID.fromString(crntMemberUuid), prompt) != null
							? true : false;
					boolean isLiked = promptLikeRepository.findByPromptAndMemberUuid(prompt, UUID.fromString(crntMemberUuid)) != null
							? true : false;

					PromptCardResponse promptCardResponse = PromptCardResponse.from(writerInfo, prompt, commentCnt, forkCnt, talkCnt, isBookmarked, isLiked);
					promptCardResponses.add(promptCardResponse);
				}

				return promptCardResponses;

			} else {
				log.info("최근 조회한 프롬프트가 존재하지 않음");
				return null;
			}
		}
	}

	/*
    memberUuid로 프롬프트 조회
     */
	public PromptCardListResponse memberPrompts(String crntMemberUuid, Pageable pageable) {
		CircuitBreaker circuitBreaker = circuitBreakerFactory.create("circuitBreaker");

		Page<Prompt> prompts = promptRepository.findAllByMemberUuidAndStatusCode(UUID.fromString(crntMemberUuid), StatusCode.OPEN, pageable);
		long totalPromptsCnt = prompts.getTotalElements();
		int totalPageCnt = prompts.getTotalPages();

		List<PromptCardResponse> promptCardResponses = new ArrayList<>();
		MemberResponse writerInfo = circuitBreaker.run(() -> memberClient.getMemberInfo(UUID.fromString(crntMemberUuid)));

		for (Prompt prompt : prompts) {
			long commentCnt = promptCommentRepository.countAllByPromptPromptUuid(prompt.getPromptUuid());
			long forkCnt = promptRepository.countAllByOriginPromptUuidAndStatusCode(prompt.getPromptUuid(), StatusCode.OPEN);
			long talkCnt = talkRepository.countAllByPromptPromptUuid(prompt.getPromptUuid());

			boolean isBookmarked = promptBookmarkRepository.findByMemberUuidAndPrompt(UUID.fromString(crntMemberUuid), prompt) != null
					? true : false;
			boolean isLiked = promptLikeRepository.findByPromptAndMemberUuid(prompt, UUID.fromString(crntMemberUuid)) != null
					? true : false;

			PromptCardResponse promptCardResponse = PromptCardResponse.from(writerInfo, prompt, commentCnt, forkCnt, talkCnt, isBookmarked, isLiked);
			promptCardResponses.add(promptCardResponse);
		}

		return PromptCardListResponse.from(totalPromptsCnt, totalPageCnt, promptCardResponses);
	}

    public GptApiResponse testGptApi(GptApiRequest data) {

		String prefix = data.getPrefix();
		String example = data.getExample();
		String suffix = data.getSuffix();

		String content = "";

		if (prefix != null) {
			content += prefix;
		}
		if (example != null) {
			content += example;
		}
		if (suffix != null) {
			content += suffix;
		}

		// create a request
		List<ChatGptMessage> chatGptMessages = new ArrayList<>();
		ChatGptMessage chatGptMessage = new ChatGptMessage("user", content);
		chatGptMessages.add(chatGptMessage);
		ChatGptRequest request = new ChatGptRequest(MODEL, chatGptMessages);

		// call the API
		ChatGptResponse response = restTemplate.postForObject(URL, request, ChatGptResponse.class);

		if (response == null || response.getChoices() == null || response.getChoices().isEmpty()) {
			return new GptApiResponse("No response");
		}

		// return the first response
		final String answer = response.getChoices().get(0).getMessage().getContent();
		return new GptApiResponse(answer);
    }

    public GptApiResponse getChatGptAnswer(AppChatGptRequest data) {
		// create a request
		ChatGptRequest request = new ChatGptRequest(MODEL, data);

		// call the API
		ChatGptResponse response = restTemplate.postForObject(URL, request, ChatGptResponse.class);

		if (response == null || response.getChoices() == null || response.getChoices().isEmpty()) {
			return new GptApiResponse("No response");
		}

		// return the first response
		final String answer = response.getChoices().get(0).getMessage().getContent();
		return new GptApiResponse(answer);
    }

	public NoticeRequest sendUserNotice(String promptUuid, String crntMemberUuid) {

		Prompt prompt = promptRepository.findByPromptUuid(UUID.fromString(promptUuid))
				.orElseThrow(PromptNotFoundException::new);

		NoticeRequest newNotice = new NoticeRequest(crntMemberUuid,
				"사용해본 프롬프트를 평가하세요 : " + prompt.getTitle(),
				"평가 url");

		kafkaProducer.sendNotification("send-notification", newNotice);

		return newNotice;
	}

    public List<PromptCardResponse> findRecommendedPrompts(String crntMemberUuid) {
		CircuitBreaker circuitBreaker = circuitBreakerFactory.create("circuitBreaker");
		Long memberId = circuitBreaker.run(() -> memberClient.getLongId(crntMemberUuid));
		long count = promptRepository.count();
		log.info("count = " + count);
		// 프롬프트 개수 200개 이상일 경우 ES 추천 알고리즘 적용
		if (count < 200) {
			// 최근 조회한  50개의 기록 중에 가장 조회가 많은 카테고리 2개를 가져온다
			// 조회수, 좋아요 수, 평점의 가중치를 통해서 추천 진행
			HashMap<String, Long> map = new HashMap<>();
			long businessCnt = promptRepository.countAllByMemberUuidAndCategory(UUID.fromString(crntMemberUuid), Category.BUSINESS);
			long etcCnt = promptRepository.countAllByMemberUuidAndCategory(UUID.fromString(crntMemberUuid), Category.ETC);
			long funCnt = promptRepository.countAllByMemberUuidAndCategory(UUID.fromString(crntMemberUuid), Category.FUN);
			long studyCnt = promptRepository.countAllByMemberUuidAndCategory(UUID.fromString(crntMemberUuid), Category.STUDY);
			long programmingCnt = promptRepository.countAllByMemberUuidAndCategory(UUID.fromString(crntMemberUuid), Category.PROGRAMMING);

			map.put(Category.BUSINESS.getDescription().toUpperCase(), businessCnt);
			map.put(Category.ETC.getDescription().toUpperCase(), etcCnt);
			map.put(Category.FUN.getDescription().toUpperCase(), funCnt);
			map.put(Category.STUDY.getDescription().toUpperCase(), studyCnt);
			map.put(Category.PROGRAMMING.getDescription().toUpperCase(), programmingCnt);

			// 개수가 가장 많은 카테고리 2개 추출
			Map<String, Long> sortedMap = map.entrySet()
					.stream()
					.sorted(Map.Entry.comparingByValue(Comparator.reverseOrder()))
					.limit(2)
					.collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));

			sortedMap.forEach((category, cnt) -> log.info("category = " + category + " cnt = " + cnt));

			// 가장 많은 개수를 가진 2개의 카테고리 추출
			List<String> topCategories = sortedMap.keySet()
					.stream()
					.limit(2)
					.collect(Collectors.toList());

			// 각 카테고리에 해당하는 prompt 추출
			List<RatingDto> top1Prompts = promptRepository.findAllByCategory(Category.valueOf(topCategories.get(0)));
			List<RatingDto> top2Prompts = promptRepository.findAllByCategory(Category.valueOf(topCategories.get(1)));

			log.info("top1Prompts = " + top1Prompts);
			log.info("top2Prompts = " + top2Prompts);

			HashMap<Long, Double> score_top1_map = new HashMap<>();

			for (RatingDto top1Prompt : top1Prompts) {
				// 조회수와 좋아요 수 그리고 평점
				long hitCount = top1Prompt.getHit();
				long likeCount = top1Prompt.getLikeCnt();
				int score = top1Prompt.getScore() == null ? 3 : top1Prompt.getScore();

				// 간단한 추천 점수 계산 (예시: 조회수의 가중치 0.7, 좋아요 수의 가중치 0.3)
				double recommend_score = 0.3 * hitCount + 0.3 * likeCount + 0.4 * score;
				log.info("hitCnt = " + hitCount + " likeCnt = " + likeCount + " score = " + score);
				log.info("recommend_score" + recommend_score);
				score_top1_map.put(top1Prompt.getPrompId(), recommend_score);
			}

			// score_top1_map을 내림차순으로 정렬
			List<Map.Entry<Long, Double>> sortedTop1Scores = score_top1_map.entrySet()
					.stream()
					.sorted(Map.Entry.comparingByValue(Comparator.reverseOrder()))
					.limit(5)
					.collect(Collectors.toList());

			// 상위 5개의 Prompt 가져오기
			List<Long> promptTop1Ids = sortedTop1Scores.stream()
					.map(Map.Entry::getKey)
					.collect(Collectors.toList());

			List<Prompt> recommendedTop1Prompts = promptRepository.findAllByIdIn(promptTop1Ids);

			log.info("recommendedPrompts = " + recommendedTop1Prompts);

			///////////2번째 카테고리///////

			HashMap<Long, Double> score_top2_map = new HashMap<>();

			for (RatingDto top2Prompt : top2Prompts) {
				// 조회수와 좋아요 수 그리고 평점
				long hitCount = top2Prompt.getHit();
				long likeCount = top2Prompt.getLikeCnt();
				int score = top2Prompt.getScore() == null ? 3 : top2Prompt.getScore();

				// 간단한 추천 점수 계산 (예시: 조회수의 가중치 0.7, 좋아요 수의 가중치 0.3)
				double recommend_score = 0.3 * hitCount + 0.3 * likeCount + 0.4 * score;
				log.info("hitCnt = " + hitCount + " likeCnt = " + likeCount + " score = " + score);
				log.info("recommend_score" + recommend_score);
				score_top2_map.put(top2Prompt.getPrompId(), recommend_score);
			}

			// score_top2_map을 내림차순으로 정렬
			List<Map.Entry<Long, Double>> sortedTop2Scores = score_top2_map.entrySet()
					.stream()
					.sorted(Map.Entry.comparingByValue(Comparator.reverseOrder()))
					.limit(5)
					.collect(Collectors.toList());

			// 상위 5개의 Prompt 가져오기
			List<Long> promptTop2Ids = sortedTop2Scores.stream()
					.map(Map.Entry::getKey)
					.collect(Collectors.toList());

			List<Prompt> recommendedTop2Prompts = promptRepository.findAllByIdIn(promptTop2Ids);

			log.info("recommendedTop2Prompts = " + recommendedTop2Prompts);

			List<Prompt> combinedPrompts = new ArrayList<>();
			combinedPrompts.addAll(recommendedTop1Prompts);
			combinedPrompts.addAll(recommendedTop2Prompts);

			Collections.shuffle(combinedPrompts);
			log.info("combinedPrompts = " + combinedPrompts);

			List<PromptCardResponse> promptCardResponses = new ArrayList<>();

			for (Prompt prompt : combinedPrompts) {
				long commentCnt = promptCommentRepository.countAllByPromptPromptUuid(prompt.getPromptUuid());
				long forkCnt = promptRepository.countAllByOriginPromptUuidAndStatusCode(prompt.getPromptUuid(), StatusCode.OPEN);
				long talkCnt = talkRepository.countAllByPromptPromptUuid(prompt.getPromptUuid());

				MemberResponse writerInfo = circuitBreaker.run(() -> memberClient.getMemberInfo(prompt.getMemberUuid()));

				boolean isBookmarked = promptBookmarkRepository.findByMemberUuidAndPrompt(UUID.fromString(crntMemberUuid), prompt) != null
						? true : false;
				boolean isLiked = promptLikeRepository.findByPromptAndMemberUuid(prompt, UUID.fromString(crntMemberUuid)) != null
						? true : false;

				PromptCardResponse promptCardResponse = PromptCardResponse.from(writerInfo, prompt, commentCnt, forkCnt, talkCnt, isBookmarked, isLiked);
				promptCardResponses.add(promptCardResponse);

			}

			return promptCardResponses;

		} else {

			// Elastic Search 기반 추천 알고리즘
			final List<Long> ub = recommenderService.userBasedRecommend(memberId);
			final List<Long> ib = recommenderService.itemBasedRecommend(memberId);

			Set<Long> promptIdSet = new HashSet<>();
			for (int i=0; i<10; i++) {
				promptIdSet.add(ub.get(i));
				promptIdSet.add(ib.get(i));
			}

			List<Long> promptIds = List.copyOf(promptIdSet);


			List<PromptCardResponse> promptCardResponses = new ArrayList<>();
			for (int i=0; i<10; i++) {
				Prompt prompt = promptRepository.findById(promptIds.get(i))
						.orElseThrow(PromptNotFoundException::new);

				long commentCnt = promptCommentRepository.countAllByPromptPromptUuid(prompt.getPromptUuid());
				long forkCnt = promptRepository.countAllByOriginPromptUuidAndStatusCode(prompt.getPromptUuid(), StatusCode.OPEN);
				long talkCnt = talkRepository.countAllByPromptPromptUuid(prompt.getPromptUuid());

				MemberResponse writerInfo = circuitBreaker.run(() -> memberClient.getMemberInfo(prompt.getMemberUuid()));

				boolean isBookmarked = promptBookmarkRepository.findByMemberUuidAndPrompt(UUID.fromString(crntMemberUuid), prompt) != null
						? true : false;
				boolean isLiked = promptLikeRepository.findByPromptAndMemberUuid(prompt, UUID.fromString(crntMemberUuid)) != null
						? true : false;

				PromptCardResponse promptCardResponse = PromptCardResponse.from(writerInfo, prompt, commentCnt, forkCnt, talkCnt, isBookmarked, isLiked);
				promptCardResponses.add(promptCardResponse);
			}

			return promptCardResponses;

		}



    }

	public List<PromptResponse> testSearch(String keyword, Pageable pageable) {
		List<Prompt> prompts = promptRepository
			.findByTitleContainsOrDescriptionContainsOrPrefixContainsOrSuffixContainsOrExampleContains(
			keyword, keyword, keyword, keyword, keyword, pageable);

		List<PromptResponse> promptResponses = new ArrayList<>();
		for (Prompt prompt : prompts) {
			PromptResponse promptResponse = PromptResponse.from(prompt);
			promptResponses.add(promptResponse);
		}
		return promptResponses;
	}
}
