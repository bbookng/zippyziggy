package com.zippyziggy.notice.kafka;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zippyziggy.notice.dto.request.NotificationRequest;
import com.zippyziggy.notice.service.AlarmService;

@Transactional
@RequiredArgsConstructor
@Service
@Slf4j
public class KafkaConsumer {

	private final AlarmService alarmService;
	private final ObjectMapper objectMapper = new ObjectMapper();

	@SuppressWarnings("ResultOfMethodCallIgnored")
	@KafkaListener(topics = "send-notification")
	public void sendNotice(String noticeRequest) {
		log.info("kafka Message -> :", noticeRequest);
		try {
			NotificationRequest notificationRequest = objectMapper.readValue(noticeRequest, NotificationRequest.class);
			alarmService.send(notificationRequest.getMemberUuid(), notificationRequest.getContent(), notificationRequest.getUrlValue());
		} catch (JsonMappingException e) {
			
			throw new RuntimeException(e);
			
		} catch (JsonProcessingException e) {
			
			throw new RuntimeException(e);
		}
	}

}
