package com.zippyziggy.notice.kafka;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

import com.zippyziggy.notice.dto.request.NotificationRequest;
import com.zippyziggy.notice.service.AlarmService;

@Transactional
@RequiredArgsConstructor
@Service
@Slf4j
public class KafkaConsumer {

	private final AlarmService alarmService;

	@SuppressWarnings("ResultOfMethodCallIgnored")
	@KafkaListener(topics = "send-notification")
	public void sendNotice(NotificationRequest data) {
		log.info("kafka Message -> :", data);
		alarmService.send(data.getMemberUuid(), data.getContent(), data.getUrlValue());
	}

}
