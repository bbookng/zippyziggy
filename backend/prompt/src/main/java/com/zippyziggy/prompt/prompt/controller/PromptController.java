package com.zippyziggy.prompt.prompt.controller;

import java.util.List;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.zippyziggy.prompt.prompt.model.Prompt;
import com.zippyziggy.prompt.prompt.repository.PromptRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.context.annotation.Bean;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
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

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.security.SecurityScheme;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/prompts")
@RequiredArgsConstructor
@Tag(name = "프롬프트 API")
public class PromptController {

	private final PromptService promptService;
	private final ForkPromptService forkPromptService;
	private final PromptCommentService promptCommentService;
	private final PromptRepository promptRepository;

	@Bean
	public OpenAPI customOpenAPI() {
		return new OpenAPI().components(new Components().addSecuritySchemes("bearer-key",
				new SecurityScheme().type(SecurityScheme.Type.HTTP).scheme("bearer").bearerFormat("JWT")));
	}

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
		promptService.updateHit(UUID.fromString(promptUuid), request, response);
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
		promptService.removePrompt(UUID.fromString(promptUuid), UUID.fromString(crntMemberUuid));
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
																	Pageable pageable,
																	@RequestHeader String crntMemberUuid) {
		ForkedPromptListResponse forkedPromptList = forkPromptService.getForkedPromptList(UUID.fromString(promptUuid),
				pageable, crntMemberUuid);
		return ResponseEntity.ok(forkedPromptList);
	}

	@Operation(summary = "프롬프트 댓글 조회", description = "프롬프트 상세 페이지에서 해당 프롬프트의 댓글 목록을 조회한다.")
	@GetMapping("/{promptUuid}/comments")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "성공"),
			@ApiResponse(responseCode = "400", description = "잘못된 요청"),
			@ApiResponse(responseCode = "500", description = "서버 에러")
	})
	public ResponseEntity<PromptCommentListResponse> getPromptComments(@PathVariable String promptUuid,
																	   @PageableDefault(size = 8, sort = "id",  direction = Sort.Direction.DESC)
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
	@PutMapping("/{promptUuid}/commments/{commentId}")
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


	@PostMapping("/{promptUuid}/like")
	@Operation(summary = "프롬프트 좋아요 하기", description = "프롬프트에 좋아요 처리 진행. prompt의 UUID를 Pathvariable로 제공해야한다.")
	public ResponseEntity<?> likePrompt(@PathVariable UUID promptUuid,
										@RequestHeader String crntMemberUuid) {

		System.out.println("promptUuid = " + promptUuid);
		promptService.likePrompt(promptUuid, crntMemberUuid);

		return ResponseEntity.ok("좋아요 처리 완료");
	}

	@GetMapping("/members/like")
	@Operation(summary = "프롬프트 좋아요 조회", description = "프롬프트를 좋아요한 상태이면 true 반환, 좋아요 상태가 아니면 false 반환")
	public ResponseEntity<?> likePromptByMember(@RequestHeader String crntMemberUuid,
												@RequestParam("page") Integer page, @RequestParam("size") Integer size) {
		PageRequest pageRequest = PageRequest.of(page, size);
		return ResponseEntity.ok(promptService.likePromptsByMember(UUID.fromString(crntMemberUuid), pageRequest));
	}

	@GetMapping("/all")
	public ResponseEntity<?> promptAll() {
		List<Prompt> prompts = promptRepository.findAll();
		for (Prompt pt: prompts) {
			System.out.println("pt = " + pt);
			System.out.println("pt = " + pt.getPromptUuid());
		}
		return ResponseEntity.ok("좋아");
	}

}
