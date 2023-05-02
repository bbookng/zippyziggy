package com.zippyziggy.prompt.talk.controller;

import com.zippyziggy.prompt.talk.dto.request.TalkCommentRequest;
import com.zippyziggy.prompt.talk.dto.request.TalkRequest;
import com.zippyziggy.prompt.talk.dto.response.TalkCommentListResponse;
import com.zippyziggy.prompt.talk.dto.response.TalkCommentResponse;
import com.zippyziggy.prompt.talk.dto.response.TalkDetailResponse;
import com.zippyziggy.prompt.talk.dto.response.TalkListResponse;
import com.zippyziggy.prompt.talk.dto.response.TalkResponse;
import com.zippyziggy.prompt.talk.service.TalkCommentService;
import com.zippyziggy.prompt.talk.service.TalkService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/talks")
@RequiredArgsConstructor
@Tag(name = "톡 API")
public class TalkController {

	private final TalkService talkService;
	private final TalkCommentService talkCommentService;

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

	@Operation(summary = "톡 삭제", description = "톡을 삭제한다.")
	@DeleteMapping("/{talkId}")
	@ApiResponses({
			@ApiResponse(responseCode = "204", description = "삭제 완료"),
			@ApiResponse(responseCode = "400", description = "잘못된 요청"),
			@ApiResponse(responseCode = "500", description = "서버 에러")
	})
	public ResponseEntity<Void> removeTalk(
			@RequestHeader String crntMemberUuid,
			@PathVariable Long talkId
	) {
		talkService.removeTalk(UUID.fromString(crntMemberUuid), talkId);
		return ResponseEntity.noContent().build();
	}

	@Operation(summary = "톡 상세 조회", description = "톡 상세페이지를 조회한다. 프롬프트 활용 프롬프트면 Pagable 관련 없음 ! 안써도 됨")
	@GetMapping("/{talkId}")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "성공"),
			@ApiResponse(responseCode = "400", description = "잘못된 요청"),
			@ApiResponse(responseCode = "500", description = "서버 에러")
	})
	public ResponseEntity<TalkDetailResponse> getTalkDetail(@PathVariable Long talkId, @RequestHeader String crntMemberUuid, @PageableDefault(sort = "regDt",  direction = Sort.Direction.DESC) Pageable pageable) {
		return ResponseEntity.ok(talkService.getTalkDetail(talkId, crntMemberUuid, pageable));
	}

	@Operation(summary = "톡 댓글 조회", description = "톡 상세페이지에서 댓글을 조회한다.")
	@GetMapping("/{talkId}/comments")
	public ResponseEntity<TalkCommentListResponse> getTalkComments(
			@PathVariable Long talkId,
			@PageableDefault(size = 8, sort = "regDt")
			Pageable pageable
	) {
		final TalkCommentListResponse talkCommentList = talkCommentService.getTalkCommentList(talkId, pageable);
		return ResponseEntity.ok(talkCommentList);
	}

	@Operation(summary = "톡 댓글 생성", description = "톡에 새로운 댓글을 생성한다.")
	@PostMapping("/{talkId}/comments")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "성공"),
			@ApiResponse(responseCode = "400", description = "잘못된 요청"),
			@ApiResponse(responseCode = "500", description = "서버 에러")
	})
	public ResponseEntity<TalkCommentResponse> createTalkComment(
			@PathVariable Long talkId,
			@RequestBody TalkCommentRequest data,
			@RequestHeader String crntMemberUuid
			) {
		final TalkCommentResponse talkComment = talkCommentService.createTalkComment(talkId, data, UUID.fromString(crntMemberUuid));
		return ResponseEntity.ok(talkComment);
	}

	@Operation(summary = "톡 댓글 수정", description = "톡 게시물에 본인이 작성한 댓글을 수정한다.")
	@PutMapping("/{talkId}/comments/{commentId}")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "성공"),
			@ApiResponse(responseCode = "400", description = "잘못된 요청"),
			@ApiResponse(responseCode = "500", description = "서버 에러")
	})
	public ResponseEntity<TalkCommentResponse> modifyTalkComment(
			@PathVariable Long commentId,
			@RequestBody TalkCommentRequest data,
			@RequestHeader String crntMemberUuid
	) {
		final TalkCommentResponse comment = talkCommentService.modifyTalkComment(commentId, data, UUID.fromString(crntMemberUuid));
		return ResponseEntity.ok(comment);
	}

	@Operation(summary = "톡 댓글 삭제", description = "톡 게시물에 본인이 작성한 댓글을 삭제한다.")
	@DeleteMapping("/{talkId}/comments/{commentId}")
	@ApiResponses({
			@ApiResponse(responseCode = "204", description = "삭제 완료"),
			@ApiResponse(responseCode = "400", description = "잘못된 요청"),
			@ApiResponse(responseCode = "500", description = "서버 에러")
	})
	public ResponseEntity<Void> removeTalkComment(
		@PathVariable Long commentId,
		@RequestHeader String crntMemberUuid
	) {
		talkCommentService.removeTalkComment(commentId, UUID.fromString(crntMemberUuid));
		return ResponseEntity.noContent().build();
	}

	@Operation(summary = "톡 좋아요", description = "현재 로그인된 유저가 톡 게시물을 좋아요 한다.")
	@PostMapping("/{talkId}/like")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "좋아요 완료"),
			@ApiResponse(responseCode = "400", description = "잘못된 요청"),
			@ApiResponse(responseCode = "500", description = "서버 에러")
	})
	public ResponseEntity<Void> likeTalk(
			@PathVariable Long talkId,
			@RequestHeader String crntMemberUuid
	) {
		talkService.likeTalk(talkId, UUID.fromString(crntMemberUuid));
		return ResponseEntity.ok().build();
	}

	@Operation(summary = "톡 좋아요 취소", description = "현재 로그인된 유저가 톡 게시물을 좋아요 취소한다.")
	@DeleteMapping("/{talkId}/like")
	@ApiResponses({
			@ApiResponse(responseCode = "204", description = "좋아요 취소 완료"),
			@ApiResponse(responseCode = "400", description = "잘못된 요청"),
			@ApiResponse(responseCode = "500", description = "서버 에러")
	})
	public ResponseEntity<Void> unlikeTalk(
			@PathVariable Long talkId,
			@RequestHeader String crntMemberUuid
	) {
		talkService.unlikeTalk(talkId, UUID.fromString(crntMemberUuid));
		return ResponseEntity.noContent().build();
	}
}
