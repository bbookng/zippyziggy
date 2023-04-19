package com.zippyziggy.prompt.prompt.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.zippyziggy.prompt.prompt.dto.request.PromptRequest;
import com.zippyziggy.prompt.prompt.dto.response.PromptDetailResponse;
import com.zippyziggy.prompt.prompt.dto.response.PromptResponse;
import com.zippyziggy.prompt.prompt.service.PromptService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/prompts")
@RequiredArgsConstructor
@Api(tags = {"프롬프트"})
public class PromptController {

	private final PromptService promptService;

	@ApiOperation(value = "프롬프트 생성", notes = "프롬프트를 생성한다.")
	@PostMapping(value = "", consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
	public ResponseEntity<PromptResponse> createPrompt(@RequestPart PromptRequest data, @RequestPart MultipartFile thumbnail) {
		PromptResponse prompt = promptService.createPrompt(data, thumbnail);
		return ResponseEntity.ok(prompt);
	}

	// 수정 필요
	@ApiOperation(value = "프롬프트 임시 저장", notes = "프롬프트를 생성 시 임시 저장한다.")
	@PostMapping(value = "/temp", consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
	public ResponseEntity<PromptResponse> createPromptTemp(@RequestPart PromptRequest data, @RequestPart MultipartFile thumbnail) {
		PromptResponse prompt = promptService.createPrompt(data, thumbnail);
		return ResponseEntity.ok(prompt);
	}

	@ApiOperation(value = "프롬프트 상세 조회", notes = "프롬프트 상세 페이지를 조회한다.")
	@GetMapping("/{promptId}")
	public ResponseEntity<PromptDetailResponse> readPromptDetail(@PathVariable Long promptId,
		HttpServletRequest request,
		HttpServletResponse response) {
		promptService.updateHit(promptId, request, response);
		PromptDetailResponse prompt = promptService.findPromptById(promptId);
		return ResponseEntity.ok(prompt);
	}

	@ApiOperation(value = "프롬프트 삭제", notes = "프롬프트를 삭제한다.")
	@DeleteMapping("/{promptId}")
	public ResponseEntity<?> deletePrompt(@PathVariable Long promptId) {
		promptService.deletePrompt(promptId);
		return ResponseEntity.ok("삭제 완료");
	}

	@ApiOperation(value = "프롬프트 포크 생성", notes = "프롬프트를 포크한 새로운 게시물을 생성한다.")
	@PostMapping("/{promptId}/fork")
	public ResponseEntity<?> createForkPrompt() {
		return null;
	}

	@ApiOperation(value = "프롬프트 포크 목록 조회", notes = "프롬프트 상세페이지에서 해당 프롬프트를 포크한 포크 프롬프트들을 조회한다.")
	@GetMapping("/{promptId}/fork")
	public ResponseEntity<?> readForkedPrompt() {
		return null;
	}

	@ApiOperation(value = "프롬프트 댓글 조회", notes = "프롬프트 상세 페이지에서 해당 프롬프트의 댓글 목록을 조회한다.")
	@GetMapping("/{promptId}/comments")
	public ResponseEntity<?> readPromptComments() {
		return null;
	}

	@ApiOperation(value = "프롬프트 댓글 생성", notes = "프롬프트에 댓글을 작성한다.")
	@PostMapping("/{promptId}/comments")
	public ResponseEntity<?> createPromptComment() {
		return null;
	}

	@ApiOperation(value = "프롬프트 댓글 삭제", notes = "프롬프트에 작성한 본인의 댓글을 삭제한다.")
	@DeleteMapping("/{promptId}/comments/{commentId}")
	public ResponseEntity<?> deletePromptComment() {
		return null;
	}


}
