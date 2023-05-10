package com.zippyziggy.notice.controller;

import com.zippyziggy.notice.dto.request.NotificationRequest;
import com.zippyziggy.notice.dto.response.EmittersResponse;
import com.zippyziggy.notice.entity.AlarmEntity;
import com.zippyziggy.notice.repository.AlarmRepository;
import com.zippyziggy.notice.service.AlarmService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import javax.servlet.http.HttpServletResponse;
import java.util.List;

@RestController
@RequestMapping("/notice")
@RequiredArgsConstructor
@Slf4j
public class AlarmController {

	private final AlarmService alarmService;
	private final AlarmRepository alarmRepository;


	@Operation(summary = "구독하기", description = "해당 멤버의 SseEmitter 객체를 만든다.")
	@GetMapping(value = "/subscribe/{memberUuid}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "성공"),
			@ApiResponse(responseCode = "400", description = "잘못된 요청"),
			@ApiResponse(responseCode = "500", description = "서버 에러")
	})
	public ResponseEntity<SseEmitter> subscribe(@PathVariable String memberUuid,
												@RequestHeader(value = "Last-Event-ID", required = false, defaultValue = "") String lastEventId,
												HttpServletResponse response) {
		response.setHeader("Connection", "keep-alive");
		response.setHeader("Cache-Control", "no-cache");
		response.setHeader("X-Accel-Buffering", "no");

		return ResponseEntity.ok(alarmService.subscribe(memberUuid, lastEventId));

	}

	@Operation(summary = "해당 알림 삭제", description = "alarmId를 pathvariable로 보내면 해당 알림 삭제 진행")
	@DeleteMapping("/alarm/{alarmId}")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "성공"),
			@ApiResponse(responseCode = "400", description = "잘못된 요청"),
			@ApiResponse(responseCode = "500", description = "서버 에러")
	})
	public ResponseEntity<?> deleteAlarmById(@PathVariable Long alarmId) {
		alarmService.deleteAlarmById(alarmId);
		return ResponseEntity.ok("해당 알림 삭제 완료");
	}

	@Operation(summary = "해당 유저의 알림 전체 삭제", description = "memberUuid를 pathvariable로 보내면 해당 유저의 모든 알림을 삭제한다.")
	@DeleteMapping("/alarm/members/{memberUuid}")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "성공"),
			@ApiResponse(responseCode = "400", description = "잘못된 요청"),
			@ApiResponse(responseCode = "500", description = "서버 에러")
	})
	public ResponseEntity<?> deleteAlarmAll(@PathVariable  String memberUuid) {
		alarmService.deleteAlarmByMemberUuid(memberUuid);
		return ResponseEntity.ok("유저관련 알람 전체 삭제 완료");
	}

	@Operation(summary = "해당 알림 읽음 처리", description = "alarmId를 pathvariable로 보내면 해당 알림을 읽는다. isRead가 true로 반환된다.")
	@PutMapping("/alarm/{alarmId}")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "성공"),
			@ApiResponse(responseCode = "400", description = "잘못된 요청"),
			@ApiResponse(responseCode = "500", description = "서버 에러")
	})
	public ResponseEntity<?> readAlarmById(@PathVariable Long alarmId) {
		alarmService.readAlarmById(alarmId);
		return ResponseEntity.ok("해당 알림 읽기 완료");
	}

	@Operation(summary = "해당 유저의 알림 모두 읽기 처리", description = "memberUuid를 pathvariable로 보내면 읽지 않은 알림을 모두 읽기 처리한다.")
	@PutMapping("/alarm/members/{memberUuid}")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "성공"),
			@ApiResponse(responseCode = "400", description = "잘못된 요청"),
			@ApiResponse(responseCode = "500", description = "서버 에러")
	})
	public ResponseEntity<?> readAlarmAllByMemberUuid(@PathVariable String memberUuid) {
		alarmService.readAlarmAllByMemberUuid(memberUuid);
		return ResponseEntity.ok("해당 유저의 알람 모두 읽기 완료");
	}

	@Operation(summary = "해당 유저의 알림 모두 조회", description = "memberUuid를 pathvariable로 보내면 관련된 알림을 모두 조회한다. 단, page와 size를 param으로 입력해주어야 한다.")
	@GetMapping("/alarm/members/{memberUuid}")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "성공"),
			@ApiResponse(responseCode = "400", description = "잘못된 요청"),
			@ApiResponse(responseCode = "500", description = "서버 에러")
	})
	public ResponseEntity<List<AlarmEntity>> findMemberAlarmList(@PathVariable String memberUuid,
																 @RequestParam("page") Integer page,
																 @RequestParam("size") Integer size) {
		return ResponseEntity.ok(alarmService.findMemberAlarmList(memberUuid, page, size));
	}

	@Operation(summary = "해당 유저의 읽지 않은 알림 개수 조회", description = "memberUuid를 pathvariable로 보내면 해당 유저의 읽지 않은 알림 총 개수를 반환해준다.")
	@GetMapping("/alarm/unread/count/{memberUuid}")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "성공"),
			@ApiResponse(responseCode = "400", description = "잘못된 요청"),
			@ApiResponse(responseCode = "500", description = "서버 에러")
	})
	public ResponseEntity<Long> countUnReadAlarmByMemberUuid(@PathVariable String memberUuid) {
		return ResponseEntity.ok(alarmService.countUnReadAlarmByMemberUuid(memberUuid));
	}


	@GetMapping("/emitters")
	@Operation(hidden = true)
	public ResponseEntity<?> test() {
		;
		return ResponseEntity.ok(EmittersResponse.builder()
				.emitters(alarmRepository.findAllEmitters())
				.eventCache(alarmRepository.findAllCacheEmitters()).build());
	}


	// method for dispatching events to all clients
	@PostMapping(value = "/dispatchEvent")
	@Operation(hidden = true)
	public ResponseEntity<?> dispatchEventsToClients(@RequestBody NotificationRequest notificationRequest) {

		alarmService.send(notificationRequest.getMemberUuid(), notificationRequest.getContent(), notificationRequest.getUrlValue());

		return ResponseEntity.ok(notificationRequest);
	}


}
