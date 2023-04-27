package com.zippyziggy.prompt.talk.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/talks")
@RequiredArgsConstructor
@Tag(name = "톡 API")
public class TalkController {

	@Operation(summary = "톡 목록 조회", description = "톡 목록을 전체 조회한다.")
	@GetMapping("")
	public ResponseEntity<?> getTalkList() {
		return null;
	}

	@Operation(summary = "톡 생성", description = "새로운 톡을 생성한다.")
	@PostMapping("")
	public ResponseEntity<?> createTalk() {
		return null;
	}

	@Operation(summary = "톡 상세 조회", description = "톡 상세페이지를 조회한다.")
	@GetMapping("/{talkId}")
	public ResponseEntity<?> getTalkDetail() {
		return null;
	}

	@Operation(summary = "톡 댓글 조회", description = "톡 상세페이지에서 댓글을 조회한다.")
	@GetMapping("/{talkId}/comments")
	public ResponseEntity<?> getTalkComments() {
		return null;
	}

	@Operation(summary = "톡 댓글 생성", description = "톡에 새로운 댓글을 생성한다.")
	@PostMapping("/{talkId}/comments")
	public ResponseEntity<?> createTalkComment() {
		return null;
	}

	@Operation(summary = "톡 댓글 수정", description = "톡 게시물에 본인이 작성한 댓글을 수정한다.")
	@PutMapping("/{talkId}/comments/{commentId}")
	public ResponseEntity<?> modifyTalkComment() {
		return null;
	}

	@Operation(summary = "톡 댓글 삭제", description = "톡 게시물에 본인이 작성한 댓글을 삭제한다.")
	@DeleteMapping("/{talkId}/comments/{commentId}")
	public ResponseEntity<?> removeTalkComment() {
		return null;
	}

}
