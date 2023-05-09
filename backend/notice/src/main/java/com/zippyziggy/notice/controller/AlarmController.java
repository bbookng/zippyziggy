package com.zippyziggy.notice.controller;

import com.zippyziggy.notice.dto.request.NotificationRequest;
import com.zippyziggy.notice.dto.response.EmittersResponse;
import com.zippyziggy.notice.repository.AlarmRepository;
import com.zippyziggy.notice.service.AlarmService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import javax.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/notice")
@RequiredArgsConstructor
@Slf4j
public class AlarmController {

	private final AlarmService alarmService;
	private final AlarmRepository alarmRepository;

	@GetMapping("/emitters")
	public ResponseEntity<?> test() {
		;
		return ResponseEntity.ok(EmittersResponse.builder()
				.emitters(alarmRepository.findAllEmitters())
				.eventCache(alarmRepository.findAllCacheEmitters()).build());
	}

	//method for client subscription
	@GetMapping(value = "/subscribe/{memberUuid}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
	public ResponseEntity<SseEmitter> subscribe(@PathVariable String memberUuid,
												@RequestHeader(value = "Last-Event-ID", required = false, defaultValue = "") String lastEventId,
												HttpServletResponse response) {
		response.setHeader("Connection", "keep-alive");
		response.setHeader("Cache-Control", "no-cache");
		response.setHeader("X-Accel-Buffering", "no");

		return ResponseEntity.ok(alarmService.subscribe(memberUuid, lastEventId));


//		SseEmitter sseEmitter = new SseEmitter(Long.MAX_VALUE);
//		log.info("sseEmiter = " + sseEmitter);
//		try {
//			sseEmitter.send(SseEmitter.event().name("INIT"));
//		} catch (IOException e) {
//			e.printStackTrace();
//		}
//		log.info("emitters1 = " + emitters);
//		sseEmitter.onCompletion(() -> emitters.remove(sseEmitter));
//		log.info("emitters2 = " + emitters);
//
//		emitters.add(sseEmitter);
//		log.info("emitters3 = " + emitters);
//
//		return sseEmitter;
	}


	// method for dispatching events to all clients
	@PostMapping(value = "/dispatchEvent")
	public ResponseEntity<?> dispatchEventsToClients(@RequestBody NotificationRequest notificationRequest) {

		alarmService.send(notificationRequest.getMemberUuid(), notificationRequest.getContent(), notificationRequest.getUrlValue());

		return ResponseEntity.ok(notificationRequest);
	}


}
