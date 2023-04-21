package com.zippyziggy.prompt.prompt.service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.zippyziggy.prompt.common.aws.AwsS3Uploader;
import com.zippyziggy.prompt.prompt.dto.request.PromptRequest;
import com.zippyziggy.prompt.prompt.dto.response.PromptDetailResponse;
import com.zippyziggy.prompt.prompt.dto.response.PromptResponse;
import com.zippyziggy.prompt.prompt.exception.PromptNotFoundException;
import com.zippyziggy.prompt.prompt.model.Category;
import com.zippyziggy.prompt.prompt.model.Languages;
import com.zippyziggy.prompt.prompt.model.Prompt;
import com.zippyziggy.prompt.prompt.repository.PromptRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class PromptService{

	private static final String VIEWCOOKIENAME = "alreadyViewCookie";
	private final AwsS3Uploader awsS3Uploader;
	private final PromptRepository promptRepository;

	// Exception 처리 필요
	public PromptResponse createPrompt(PromptRequest data, MultipartFile thumbnail) {

		String thumbnailUrl = awsS3Uploader.upload(thumbnail, "thumbnails");

		Category category = Category.valueOf(data.getCategory());

		/*
		memberId 넣어야 함
		 */
		Prompt prompt = Prompt.builder()
			.title(data.getTitle())
			.category(category)
			.memberId(2L)
			.description(data.getDescription())
			.regDt(LocalDateTime.now())
			.updDt(LocalDateTime.now())
			.prefix(data.getMessage().getPrefix())
			.example(data.getMessage().getExample())
			.suffix(data.getMessage().getSuffix())
			.promptUuid(UUID.randomUUID())
			.languages(Languages.KOREAN)
			.hit(0)
			.likeCnt(0L)
			.thumbnail(thumbnailUrl)
			.build();

		promptRepository.save(prompt);

		return PromptResponse.from(prompt);
	}

	/*
	수정 로직 작성 해야 함 !!!!!!!!
	본인 댓글인지 확인 필요
	 */
	public PromptResponse modifyPrompt(UUID promptUuid, PromptRequest data, MultipartFile thumbnail) {
		return null;
	}

	public int updateHit(UUID promptUuid, HttpServletRequest request, HttpServletResponse response) {

		Long promptId = promptRepository.findByPromptUuid(promptUuid).orElseThrow(PromptNotFoundException::new).getId();
		Cookie[] cookies = request.getCookies();
		boolean checkCookie = false;
		int result = 0;
		if(cookies != null){
			for (Cookie cookie : cookies)
			{
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
		cookie.setComment("조회수 중복 증가 방지 쿠키");	// 쿠키 용도 설명 기재
		cookie.setMaxAge(getRemainSecondForTomorrow()); 	// 하루를 준다.
		cookie.setHttpOnly(true);				// 서버에서만 조작 가능
		return cookie;
	}

	// 다음 날 정각까지 남은 시간(초)
	private int getRemainSecondForTomorrow() {
		LocalDateTime now = LocalDateTime.now();
		LocalDateTime tomorrow = LocalDateTime.now().plusDays(1L).truncatedTo(ChronoUnit.DAYS);
		return (int) now.until(tomorrow, ChronoUnit.SECONDS);
	}

	/*
	member 연결되면 작성해야함
	 */
	public PromptDetailResponse getPromptDetail(UUID promptUuid) {
		Prompt prompt = promptRepository.findByPromptUuid(promptUuid).orElseThrow(PromptNotFoundException::new);
		PromptDetailResponse from = PromptDetailResponse.from(prompt);

		// 원본 id가 현재 프롬프트 아이디와 같지 않으면 포크된 프롬프트
		if (prompt.getOriginPromptUuid() != promptUuid) {
			// from.setOriginerResponse();
		}

		return from;
	}

	/*
	본인이 작성한 프롬프트인지 확인 필요
	 */

	public void removePrompt(UUID promptUuid) {
		Prompt prompt = promptRepository.findByPromptUuid(promptUuid).orElseThrow(PromptNotFoundException::new);
		awsS3Uploader.delete("thumbnails/" , prompt.getThumbnail());
		promptRepository.delete(prompt);
	}

}
