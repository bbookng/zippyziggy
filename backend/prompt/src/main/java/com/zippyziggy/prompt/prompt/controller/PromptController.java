package com.zippyziggy.prompt.prompt.controller;

import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.zippyziggy.prompt.prompt.dto.request.PromptCommentRequest;
import com.zippyziggy.prompt.prompt.dto.request.PromptModifyRequest;
import com.zippyziggy.prompt.prompt.dto.request.PromptRequest;
import com.zippyziggy.prompt.prompt.dto.response.ForkPromptResponse;
import com.zippyziggy.prompt.prompt.dto.response.ForkedPromptListResponse;
import com.zippyziggy.prompt.prompt.dto.response.PromptCommentListResponse;
import com.zippyziggy.prompt.prompt.dto.response.PromptCommentResponse;
import com.zippyziggy.prompt.prompt.dto.response.PromptDetailResponse;
import com.zippyziggy.prompt.prompt.dto.response.PromptResponse;
import com.zippyziggy.prompt.prompt.service.ForkPromptService;
import com.zippyziggy.prompt.prompt.service.PromptCommentService;
import com.zippyziggy.prompt.prompt.service.PromptService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/prompts")
@RequiredArgsConstructor
@Api(tags = {"프롬프트 API"})
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

	@ApiOperation(value = "프롬프트 생성", notes = "프롬프트를 생성한다.")
	@PostMapping(value = "", consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
	@ApiResponses({
		@ApiResponse(code = 200, message = "성공"),
		@ApiResponse(code = 400, message = "잘못된 요청"),
		@ApiResponse(code = 500, message = "서버 에러")
	})
	public ResponseEntity<PromptResponse> createPrompt(@RequestPart PromptRequest data,
													   @RequestPart MultipartFile thumbnail,
													   @RequestHeader UUID crntMemberUuid) {
		return ResponseEntity.ok(promptService.createPrompt(data, crntMemberUuid, thumbnail));
	}

	/**
	 *
	 * @param promptUuid
	 * @param data
	 * @param thumbnail
	 * @return
	 */
	@ApiOperation(value = "프롬프트 수정", notes = "본인이 작성한 프롬프트를 수정한다.")
	@PutMapping(value = "/{promptUuid}",
				consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
	@ApiResponses({
		@ApiResponse(code = 200, message = "성공"),
		@ApiResponse(code = 400, message = "잘못된 요청"),
		@ApiResponse(code = 500, message = "서버 에러")
	})
	public ResponseEntity<PromptResponse> modifyPrompt(@PathVariable UUID promptUuid,
		@RequestPart PromptModifyRequest data,
		@RequestPart MultipartFile thumbnail,
		@RequestHeader UUID crntMemberUuid) {
		return ResponseEntity.ok(promptService.modifyPrompt(promptUuid, data, crntMemberUuid, thumbnail));
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

	@ApiOperation(value = "프롬프트 상세 조회", notes = "프롬프트 상세 페이지를 조회한다.")
	@GetMapping("/{promptUuid}")
	@ApiResponses({
		@ApiResponse(code = 200, message = "성공"),
		@ApiResponse(code = 400, message = "잘못된 요청"),
		@ApiResponse(code = 500, message = "서버 에러")
	})
	public ResponseEntity<PromptDetailResponse> getPromptDetail(@PathVariable UUID promptUuid,
		@RequestHeader UUID crntMemberUuid,
		HttpServletRequest request,
		HttpServletResponse response) {
		promptService.updateHit(promptUuid, request, response);
		return ResponseEntity.ok(promptService.getPromptDetail(promptUuid, crntMemberUuid));
	}

	@ApiOperation(value = "프롬프트 삭제", notes = "프롬프트를 삭제한다.")
	@DeleteMapping("/{promptUuid}")
	@ApiResponses({
		@ApiResponse(code = 200, message = "성공"),
		@ApiResponse(code = 400, message = "잘못된 요청"),
		@ApiResponse(code = 500, message = "서버 에러")
	})
	public ResponseEntity<?> removePrompt(@PathVariable UUID promptUuid,
										  @RequestHeader UUID crntMemberUuid) {
		promptService.removePrompt(promptUuid, crntMemberUuid);
		return ResponseEntity.ok("삭제 완료");
	}

	@ApiOperation(value = "프롬프트 포크 생성", notes = "프롬프트를 포크한 새로운 게시물을 생성한다.")
	@PostMapping(value = "/{promptUuid}/fork", consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
	@ApiResponses({
		@ApiResponse(code = 200, message = "성공"),
		@ApiResponse(code = 400, message = "잘못된 요청"),
		@ApiResponse(code = 500, message = "서버 에러")
	})
	public ResponseEntity<ForkPromptResponse> createForkPrompt(@PathVariable UUID promptUuid,
		@RequestPart PromptRequest data,
		@RequestPart MultipartFile thumbnail,
	    @RequestHeader UUID crntMemberUuid) {
		ForkPromptResponse forkPrompt = forkPromptService.createForkPrompt(promptUuid, data, thumbnail, crntMemberUuid);
		return ResponseEntity.ok(forkPrompt);
	}

	@ApiOperation(value = "프롬프트 포크 목록 조회", notes = "프롬프트 상세페이지에서 해당 프롬프트를 포크한 포크 프롬프트들을 조회한다.")
	@GetMapping("/{promptUuid}/fork")
	@ApiResponses({
		@ApiResponse(code = 200, message = "성공"),
		@ApiResponse(code = 400, message = "잘못된 요청"),
		@ApiResponse(code = 500, message = "서버 에러")
	})
	public ResponseEntity<ForkedPromptListResponse> getForkedPrompt(@PathVariable UUID promptUuid, Pageable pageable) {
		ForkedPromptListResponse forkedPromptList = forkPromptService.getForkedPromptList(promptUuid, pageable);
		return ResponseEntity.ok(forkedPromptList);
	}

	@ApiOperation(value = "프롬프트 댓글 조회", notes = "프롬프트 상세 페이지에서 해당 프롬프트의 댓글 목록을 조회한다.")
	@GetMapping("/{promptUuid}/comments")
	@ApiResponses({
		@ApiResponse(code = 200, message = "성공"),
		@ApiResponse(code = 400, message = "잘못된 요청"),
		@ApiResponse(code = 500, message = "서버 에러")
	})
	public ResponseEntity<PromptCommentListResponse> getPromptComments(@PathVariable UUID promptUuid,
		@PageableDefault(size = 8, sort = "id",  direction = Sort.Direction.DESC)
		Pageable pageable) {
		PromptCommentListResponse promptCommentList = promptCommentService.getPromptCommentList(promptUuid, pageable);
		return ResponseEntity.ok(promptCommentList);
	}

	@ApiOperation(value = "프롬프트 댓글 생성", notes = "프롬프트에 댓글을 작성한다.")
	@PostMapping("/{promptUuid}/comments")
	@ApiResponses({
		@ApiResponse(code = 200, message = "성공"),
		@ApiResponse(code = 400, message = "잘못된 요청"),
		@ApiResponse(code = 500, message = "서버 에러")
	})
	public ResponseEntity<PromptCommentResponse> createPromptComment(@PathVariable UUID promptUuid,
																	 @RequestBody PromptCommentRequest data,
																	 @RequestHeader UUID crntMemberUuid) {
		PromptCommentResponse promptComment = promptCommentService.createPromptComment(promptUuid, data, crntMemberUuid);
		return ResponseEntity.ok(promptComment);
	}

	@ApiOperation(value = "프롬프트 댓글 수정", notes = "프롬프트에 작성한 본인의 댓글을 수정한다.")
	@PutMapping("/{promptUuid}/commments/{commentId}")
	@ApiResponses({
		@ApiResponse(code = 200, message = "성공"),
		@ApiResponse(code = 400, message = "잘못된 요청"),
		@ApiResponse(code = 500, message = "서버 에러")
	})
	public ResponseEntity<?> modifyPromptComment(@PathVariable Long commentId,
												 @RequestBody PromptCommentRequest data,
												 @RequestHeader UUID crntMemberUuid) {
		PromptCommentResponse comment = promptCommentService.modifyPromptComment(commentId, data, crntMemberUuid);
		return ResponseEntity.ok(comment);
	}

	@ApiOperation(value = "프롬프트 댓글 삭제", notes = "프롬프트에 작성한 본인의 댓글을 삭제한다.")
	@DeleteMapping("/{promptUuid}/comments/{commentId}")
	@ApiResponses({
		@ApiResponse(code = 200, message = "성공"),
		@ApiResponse(code = 400, message = "잘못된 요청"),
		@ApiResponse(code = 500, message = "서버 에러")
	})
	public ResponseEntity<?> removePromptComment(@PathVariable Long commentId,
												 @RequestHeader UUID crntMemberUuid) {
		promptCommentService.removePromptComment(commentId, crntMemberUuid);
		return ResponseEntity.ok("댓글 삭제 완료");
	}


}
