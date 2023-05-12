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
	@GetMapping(value = "/subscribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "성공"),
			@ApiResponse(responseCode = "400", description = "잘못된 요청"),
			@ApiResponse(responseCode = "500", description = "서버 에러")
	})
	public ResponseEntity<SseEmitter> subscribe(@RequestHeader(value = "Last-Event-ID", required = false, defaultValue = "") String lastEventId,
												HttpServletResponse response, @RequestHeader String crntMemberUuid) {

		// HTTP1.1에서는 keep-alive가 기본 속성이지만 HTTP1.0같은 경우는 명시해줘야해서 헤더에 기입
		response.setHeader("Connection", "keep-alive");

		// 클라이언트에서 이전에 전송된 이벤트를 캐쉬해버리면 실시간 성이 떨어지거나, 이전 이벤트를 놓칠 수 있어서 no-cache로 설정한다.
		response.setHeader("Cache-Control", "no-cache");

		// Nignx에서 서버의 응답을 버퍼에 저장해두었다가, 버퍼가 차거나 서버가 응답데이터를 모두 보내면 전송하게 된다
		// 그렇게 되면 SSE 통신이 원하는대로 동작하지 않거나 실시간 성이 떨어진다.
		// 그래서 버퍼링을 하지 않도록 아래와 같이 헤더에 추가해준다.
		response.setHeader("X-Accel-Buffering", "no");

		return ResponseEntity.ok(alarmService.subscribe(crntMemberUuid, lastEventId));

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
	@DeleteMapping("/alarm/members")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "성공"),
			@ApiResponse(responseCode = "400", description = "잘못된 요청"),
			@ApiResponse(responseCode = "500", description = "서버 에러")
	})
	public ResponseEntity<?> deleteAlarmAll(@RequestHeader String crntMemberUuid) {
		alarmService.deleteAlarmByMemberUuid(crntMemberUuid);
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
	@PutMapping("/alarm/members")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "성공"),
			@ApiResponse(responseCode = "400", description = "잘못된 요청"),
			@ApiResponse(responseCode = "500", description = "서버 에러")
	})
	public ResponseEntity<?> readAlarmAllByMemberUuid(@RequestHeader String crntMemberUuid) {
		alarmService.readAlarmAllByMemberUuid(crntMemberUuid);
		return ResponseEntity.ok("해당 유저의 알람 모두 읽기 완료");
	}

	@Operation(summary = "해당 유저의 알림 모두 조회", description = "memberUuid를 pathvariable로 보내면 관련된 알림을 모두 조회한다. 단, page와 size를 param으로 입력해주어야 한다.")
	@GetMapping("/alarm/members")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "성공"),
			@ApiResponse(responseCode = "400", description = "잘못된 요청"),
			@ApiResponse(responseCode = "500", description = "서버 에러")
	})
	public ResponseEntity<List<AlarmEntity>> findMemberAlarmList(@RequestHeader String crntMemberUuid,
																 @RequestParam("page") Integer page,
																 @RequestParam("size") Integer size) {
		return ResponseEntity.ok(alarmService.findMemberAlarmList(crntMemberUuid, page, size));
	}

	@Operation(summary = "해당 유저의 읽지 않은 알림 개수 조회", description = "memberUuid를 pathvariable로 보내면 해당 유저의 읽지 않은 알림 총 개수를 반환해준다.")
	@GetMapping("/alarm/unread/count")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "성공"),
			@ApiResponse(responseCode = "400", description = "잘못된 요청"),
			@ApiResponse(responseCode = "500", description = "서버 에러")
	})
	public ResponseEntity<Long> countUnReadAlarmByMemberUuid(@RequestHeader String crntMemberUuid) {
		return ResponseEntity.ok(alarmService.countUnReadAlarmByMemberUuid(crntMemberUuid));
	}


	// 단순 테스트용 사용하지 않는다.
	@GetMapping("/emitters")
	@Operation(hidden = true)
	public ResponseEntity<?> test() {
		;
		return ResponseEntity.ok(EmittersResponse.builder()
				.emitters(alarmRepository.findAllEmitters())
				.eventCache(alarmRepository.findAllCacheEmitters()).build());
	}


	// 단순 테스트용 사용하지 않는다. 알람을 보내는 경우를 설정함
	@PostMapping(value = "/dispatchEvent")
	@Operation(hidden = true)
	public ResponseEntity<?> dispatchEventsToClients(@RequestBody NotificationRequest notificationRequest) {

		alarmService.send(notificationRequest.getMemberUuid(), notificationRequest.getContent(), notificationRequest.getUrlValue());

		return ResponseEntity.ok(notificationRequest);
	}


}
