package com.zippyziggy.prompt.prompt.controller;

import com.zippyziggy.prompt.common.kafka.KafkaProducer;
import com.zippyziggy.prompt.prompt.dto.request.*;
import com.zippyziggy.prompt.prompt.dto.response.*;
import com.zippyziggy.prompt.prompt.repository.PromptRepository;
import com.zippyziggy.prompt.prompt.service.ForkPromptService;
import com.zippyziggy.prompt.prompt.service.PromptCommentService;
import com.zippyziggy.prompt.prompt.service.PromptService;
import com.zippyziggy.prompt.talk.dto.response.PromptTalkListResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/prompts")
@RequiredArgsConstructor
@Tag(name = "프롬프트 API")
public class PromptController {

	private final PromptService promptService;
	private final ForkPromptService forkPromptService;
	private final PromptCommentService promptCommentService;

	/**
	 *
	 * @param data
	 * @param thumbnail
	 * @param crntMemberUuid
	 * @return
	 */

	@Operation(summary = "프롬프트 생성", description = "프롬프트를 생성한다.")
	@PostMapping(value = "", consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "성공"),
			@ApiResponse(responseCode = "400", description = "잘못된 요청"),
			@ApiResponse(responseCode = "500", description = "서버 에러")
	})
	public ResponseEntity<PromptResponse> createPrompt(@RequestPart PromptRequest data,
													   @RequestPart MultipartFile thumbnail,
													   @RequestHeader String crntMemberUuid) {
		return ResponseEntity.ok(promptService.createPrompt(data, UUID.fromString(crntMemberUuid), thumbnail));
	}

	/**
	 *
	 * @param promptUuid
	 * @param data
	 * @param thumbnail
	 * @return
	 */
	@Operation(summary = "프롬프트 수정", description = "본인이 작성한 프롬프트를 수정한다.")
	@PutMapping(value = "/{promptUuid}",
			consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "성공"),
			@ApiResponse(responseCode = "400", description = "잘못된 요청"),
			@ApiResponse(responseCode = "500", description = "서버 에러")
	})
	public ResponseEntity<PromptResponse> modifyPrompt(@PathVariable String promptUuid,
													   @RequestPart PromptModifyRequest data,
													   @RequestPart MultipartFile thumbnail,
													   @RequestHeader String crntMemberUuid) {
		return ResponseEntity.ok(promptService.modifyPrompt(UUID.fromString(promptUuid), data, UUID.fromString(crntMemberUuid), thumbnail));
	}

	/**
	 *
	 * 3순위, 나중에 수정 필요
	 * 임시저장, 임시저장 삭제, 임시저장 후 최종 저장까지 구현해야 함
	 */
//	@ApiOperation(value = "프롬프트 임시 저장", notes = "프롬프트를 생성 시 임시 저장한다.")
//	@PostMapping(value = "/temp", consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
//	public ResponseEntity<PromptResponse> createPromptTemp(@RequestPart PromptRequest data, @RequestPart MultipartFile thumbnail) {
//		PromptResponse prompt = promptService.createPrompt(data, thumbnail);
//		return ResponseEntity.ok(prompt);
//	}
	@Operation(summary = "프롬프트 상세 조회", description = "프롬프트 상세 페이지를 조회한다.")
	@GetMapping("/{promptUuid}")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "성공"),
			@ApiResponse(responseCode = "400", description = "잘못된 요청"),
			@ApiResponse(responseCode = "500", description = "서버 에러")
	})
	public ResponseEntity<PromptDetailResponse> getPromptDetail(@PathVariable String promptUuid,
																@RequestHeader(required = false) String crntMemberUuid,
																HttpServletRequest request,
																HttpServletResponse response) {
		// promptService.updateHit(UUID.fromString(promptUuid), request, response);
		return ResponseEntity.ok(promptService.getPromptDetail(UUID.fromString(promptUuid), crntMemberUuid));
	}

	@Operation(summary = "프롬프트 삭제", description = "프롬프트를 삭제한다.")
	@DeleteMapping("/{promptUuid}")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "성공"),
			@ApiResponse(responseCode = "400", description = "잘못된 요청"),
			@ApiResponse(responseCode = "500", description = "서버 에러")
	})
	public ResponseEntity<?> removePrompt(@PathVariable String promptUuid,
										  @RequestHeader String crntMemberUuid) {
		promptService.removePrompt(promptUuid, UUID.fromString(crntMemberUuid));
		return ResponseEntity.ok("삭제 완료");
	}

	@Operation(summary = "프롬프트 포크 생성", description = "프롬프트를 포크한 새로운 게시물을 생성한다.")
	@PostMapping(value = "/{promptUuid}/fork", consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "성공"),
			@ApiResponse(responseCode = "400", description = "잘못된 요청"),
			@ApiResponse(responseCode = "500", description = "서버 에러")
	})
	public ResponseEntity<ForkPromptResponse> createForkPrompt(@PathVariable String promptUuid,
															   @RequestPart PromptRequest data,
															   @RequestPart MultipartFile thumbnail,
															   @RequestHeader String crntMemberUuid) {
		ForkPromptResponse forkPrompt = forkPromptService.createForkPrompt(UUID.fromString(promptUuid), data, thumbnail, UUID.fromString(crntMemberUuid));
		return ResponseEntity.ok(forkPrompt);
	}

	@Operation(summary = "프롬프트 포크 목록 조회", description = "프롬프트 상세페이지에서 해당 프롬프트를 포크한 포크 프롬프트들을 조회한다.")
	@GetMapping("/{promptUuid}/fork")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "성공"),
			@ApiResponse(responseCode = "400", description = "잘못된 요청"),
			@ApiResponse(responseCode = "500", description = "서버 에러")
	})
	public ResponseEntity<ForkedPromptListResponse> getForkedPrompt(@PathVariable String promptUuid,
																	@PageableDefault(sort = "regDt",  direction = Sort.Direction.DESC) Pageable pageable,
																	@RequestHeader String crntMemberUuid) {
		ForkedPromptListResponse forkedPromptList = forkPromptService.getForkedPromptList(UUID.fromString(promptUuid),
				pageable, crntMemberUuid);
		return ResponseEntity.ok(forkedPromptList);
	}

	@Operation(summary = "프롬프트 활용 톡 목록 조회", description = "해당 프롬프트를 활용하여 대화한 톡 목록을 조회한다.")
	@GetMapping("{promptUuid}/talks")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "성공"),
			@ApiResponse(responseCode = "400", description = "잘못된 요청"),
			@ApiResponse(responseCode = "500", description = "서버 에러")
	})
	public ResponseEntity<PromptTalkListResponse> getPromptTalkList(@PathVariable UUID promptUuid,
																	@RequestHeader String crntMemberUuid,
																	@PageableDefault(sort = "regDt",  direction = Sort.Direction.DESC) Pageable pageable) {
		return ResponseEntity.ok(promptService.getPromptTalkList(promptUuid, crntMemberUuid, pageable));
	}

	@Operation(summary = "프롬프트 댓글 조회", description = "프롬프트 상세 페이지에서 해당 프롬프트의 댓글 목록을 조회한다.")
	@GetMapping("/{promptUuid}/comments")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "성공"),
			@ApiResponse(responseCode = "400", description = "잘못된 요청"),
			@ApiResponse(responseCode = "500", description = "서버 에러")
	})
	public ResponseEntity<PromptCommentListResponse> getPromptComments(@PathVariable String promptUuid,
																	   @PageableDefault(sort = "id",  direction = Sort.Direction.DESC)
																	   Pageable pageable) {
		PromptCommentListResponse promptCommentList = promptCommentService.getPromptCommentList(UUID.fromString(promptUuid), pageable);
		return ResponseEntity.ok(promptCommentList);
	}

	@Operation(summary = "프롬프트 댓글 생성", description = "프롬프트에 댓글을 작성한다.")
	@PostMapping("/{promptUuid}/comments")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "성공"),
			@ApiResponse(responseCode = "400", description = "잘못된 요청"),
			@ApiResponse(responseCode = "500", description = "서버 에러")
	})
	public ResponseEntity<PromptCommentResponse> createPromptComment(@PathVariable String promptUuid,
																	 @RequestBody PromptCommentRequest data,
																	 @RequestHeader String crntMemberUuid) {
		PromptCommentResponse promptComment = promptCommentService.createPromptComment(UUID.fromString(promptUuid), data, UUID.fromString(crntMemberUuid));
		return ResponseEntity.ok(promptComment);
	}

	@Operation(summary = "프롬프트 댓글 수정", description = "프롬프트에 작성한 본인의 댓글을 수정한다.")
	@PutMapping("/{promptUuid}/comments/{commentId}")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "성공"),
			@ApiResponse(responseCode = "400", description = "잘못된 요청"),
			@ApiResponse(responseCode = "500", description = "서버 에러")
	})
	public ResponseEntity<?> modifyPromptComment(@PathVariable Long commentId,
												 @RequestBody PromptCommentRequest data,
												 @RequestHeader String crntMemberUuid) {
		PromptCommentResponse comment = promptCommentService.modifyPromptComment(commentId, data, UUID.fromString(crntMemberUuid));
		return ResponseEntity.ok(comment);
	}

	@Operation(summary = "프롬프트 댓글 삭제", description = "프롬프트에 작성한 본인의 댓글을 삭제한다.")
	@DeleteMapping("/{promptUuid}/comments/{commentId}")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "성공"),
			@ApiResponse(responseCode = "400", description = "잘못된 요청"),
			@ApiResponse(responseCode = "500", description = "서버 에러")
	})
	public ResponseEntity<?> removePromptComment(@PathVariable Long commentId,
												 @RequestHeader String crntMemberUuid) {
		promptCommentService.removePromptComment(commentId, UUID.fromString(crntMemberUuid));
		return ResponseEntity.ok("댓글 삭제 완료");
	}


	@Operation(summary = "프롬프트 좋아요 하기(Authorization 필요)", description = "프롬프트에 좋아요 처리 진행. prompt의 UUID를 Pathvariable로 제공해야한다.")
	@PostMapping("/{promptUuid}/like")
	public ResponseEntity<?> likePrompt(
			@PathVariable UUID promptUuid,
			@RequestHeader String crntMemberUuid
	) {
		promptService.likePrompt(promptUuid, crntMemberUuid);
		return ResponseEntity.ok("좋아요 처리 완료");
	}

	@Operation(hidden = true)
	@GetMapping("/members/like/{crntMemberUuid}")
	public ResponseEntity<?> likePromptByMember(@PathVariable String crntMemberUuid,
												@RequestParam("page") Integer page,
												@RequestParam("size") Integer size) {

		PageRequest pageRequest = PageRequest.of(page, size);
		return ResponseEntity.ok(promptService.likePromptsByMember(crntMemberUuid, pageRequest));
	}

	@Operation(summary = "프롬프트 북마크 하기(Authorization 필요)", description = "프롬프트 북마크 처리 진행. prompt의 UUID를 Pathvariable로 제공해야한다.")
	@PostMapping("/{promptUuid}/bookmark")
	public ResponseEntity<?> bookmarkPrompt(@PathVariable UUID promptUuid,
											@RequestHeader String crntMemberUuid) {
		promptService.bookmarkPrompt(promptUuid, crntMemberUuid);
		return ResponseEntity.ok("프롬프트 북마크 진행 완료");
	}

	@Operation(hidden = true)
	@GetMapping("/members/bookmark/{crntMemberUuid}")
	public ResponseEntity<List<PromptCardResponse>> bookmarkPromptByMember(@PathVariable String crntMemberUuid,
																		   @RequestParam("page") Integer page,
																		   @RequestParam("size") Integer size) {
		PageRequest pageRequest = PageRequest.of(page, size);
		return ResponseEntity.ok(promptService.bookmarkPromptByMember(crntMemberUuid, pageRequest));
	}

	@Operation(summary = "프롬프트 평가", description = "헤더에는 accessToken을 담고, promptUuid를 pathVariable로 전달 필요")
	@PostMapping("/{promptUuid}/rating")
	public ResponseEntity<?> ratingPrompt(@PathVariable UUID promptUuid,
										  @RequestBody PromptRatingRequest promptRatingRequest,
										  @RequestHeader String crntMemberUuid) {
		try {
			promptService.ratingPrompt(promptUuid, crntMemberUuid, promptRatingRequest);
		} catch (Exception e) {
			return new ResponseEntity<>("평가 내역이 이미 존재합니다.", HttpStatus.BAD_REQUEST);
		}
		return ResponseEntity.ok("프롬프트 북마크 평가 완료");
	}

	@Operation(summary = "프롬프트 신고", description = "프롬프트 내용을 입력하면 신고가 접수됩니다.")
	@PostMapping("/{promptUuid}/report")
	public ResponseEntity<?> reportPrompt(@RequestBody PromptReportRequest promptReportRequest,
										  @PathVariable UUID promptUuid,
										  @RequestHeader String crntMemberUuid) {
		try {
			promptService.promptReport(promptUuid, crntMemberUuid, promptReportRequest);
		} catch (Exception e) {
			return new ResponseEntity<>("신고 접수는 5개까지 가능합니다.", HttpStatus.BAD_REQUEST);
		}
		return ResponseEntity.ok("프롬프트 신고 접수 완료");
	}

	@Operation(summary = "프롬프트 신고 조회하기", description = "프롬프트 신고 내용을 확인합니다. ADMIN 권한만 가능")
	@GetMapping("/reports")
	public ResponseEntity<?> reports(@RequestParam("page") Integer page,
									 @RequestParam("size") Integer size) {
		PageRequest pageRequest = PageRequest.of(page, size);
		return ResponseEntity.ok(promptService.reports(pageRequest));
	}

	@Operation(summary = "프롬프트의 톡과 댓글 갯수", description = "promptUuid를 pathvariable로 전달 필요")
	@GetMapping("/{promptUuid}/cnt")
	public ResponseEntity<PromptTalkCommentCntResponse> cntPrompt(@PathVariable UUID promptUuid) {
		return ResponseEntity.ok(promptService.cntPrompt(promptUuid));
	}

	@Operation(summary = "최근 조회한 프롬프트 조회", description = "최근 조회한 5개의 프롬프트를 반환한다")
	@GetMapping("/members/recent/prompts")
	public ResponseEntity<?> recentPrompts(@RequestHeader String crntMemberUuid) {
		return ResponseEntity.ok(promptService.recentPrompts(crntMemberUuid));
	}

	@Operation(hidden = true)
	@GetMapping("/members/profile/{crntMemberUuid}")
	public ResponseEntity<?> memberPrompts(@PathVariable String crntMemberUuid,
										   @RequestParam("page") Integer page,
										   @RequestParam("size") Integer size) {

		PageRequest pageRequest = PageRequest.of(page, size);
		return ResponseEntity.ok(promptService.memberPrompts(crntMemberUuid, pageRequest));

	}

	@Operation(summary = "ChatGPT API", description = "프롬프트 생성 시 이용하는 ChatGPT API")
	@PostMapping(value = "/gpt", consumes = MediaType.APPLICATION_JSON_VALUE)
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "성공"),
			@ApiResponse(responseCode = "400", description = "잘못된 요청"),
			@ApiResponse(responseCode = "500", description = "서버 에러")
	})
	public ResponseEntity<String> testGptApi(@RequestBody String createTest) {
		return ResponseEntity.ok(promptService.testGptApi(createTest));
	}

}
