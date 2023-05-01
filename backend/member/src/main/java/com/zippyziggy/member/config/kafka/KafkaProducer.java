package com.zippyziggy.member.config.kafka;

import java.util.UUID;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class KafkaProducer {

	private KafkaTemplate<String, String> kafkaTemplate;

	@Autowired
	public KafkaProducer(KafkaTemplate<String, String> kafkaTemplate) {
		this.kafkaTemplate = kafkaTemplate;
	}

	public UUID send(String topic, UUID memberUuid) {

		kafkaTemplate.send(topic, memberUuid.toString());
		log.info("Kafka Producer sent data from the Order microservice: " + memberUuid);

		return memberUuid;
	}
}

