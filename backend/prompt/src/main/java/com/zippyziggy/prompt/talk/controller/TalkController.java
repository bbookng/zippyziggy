package com.zippyziggy.prompt.talk.controller;

import java.util.List;
import java.util.UUID;

import com.zippyziggy.prompt.talk.dto.response.TalkResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zippyziggy.prompt.talk.dto.request.TalkRequest;
import com.zippyziggy.prompt.talk.dto.response.TalkListResponse;
import com.zippyziggy.prompt.talk.service.TalkService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/talks")
@RequiredArgsConstructor
@Tag(name = "톡 API")
public class TalkController {

	private final TalkService talkService;

	@Operation(summary = "톡 목록 조회", description = "톡 목록을 전체 조회한다.")
	@GetMapping("")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "성공"),
			@ApiResponse(responseCode = "400", description = "잘못된 요청"),
			@ApiResponse(responseCode = "500", description = "서버 에러")
	})
	public ResponseEntity<List<TalkListResponse>> getTalkList(@RequestHeader String crntMemberuuid) {
		return ResponseEntity.ok(talkService.getTalkList(crntMemberuuid));
	}

	@Operation(summary = "톡 생성", description = "새로운 톡을 생성한다.")
	@PostMapping("")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "성공"),
			@ApiResponse(responseCode = "400", description = "잘못된 요청"),
			@ApiResponse(responseCode = "500", description = "서버 에러")
	})
	public ResponseEntity<TalkResponse> createTalk(@RequestBody TalkRequest data,
												   @RequestHeader String crntMemberUuid) {
		return ResponseEntity.ok(talkService.createTalk(data, UUID.fromString(crntMemberUuid)));
	}

	@Operation(summary = "톡 상세 조회", description = "톡 상세페이지를 조회한다. 프롬프트 활용 프롬프트면 Pagable 관련 없음 ! 안써도 됨")
	@GetMapping("/{talkId}")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "성공"),
			@ApiResponse(responseCode = "400", description = "잘못된 요청"),
			@ApiResponse(responseCode = "500", description = "서버 에러")
	})
	public ResponseEntity<?> getTalkDetail(@PathVariable Long talkId, @RequestHeader String crntMemberUuid, Pageable pageable) {
		return ResponseEntity.ok(talkService.getTalkDetail(talkId, crntMemberUuid, pageable));
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

	@Operation(summary = "톡 좋아요", description = "현재 로그인된 유저가 톡 게시물을 좋아요 한다.")
	@PostMapping("/{talkId}")
	public ResponseEntity<?> likeTalk() {
		return null;
	}

}