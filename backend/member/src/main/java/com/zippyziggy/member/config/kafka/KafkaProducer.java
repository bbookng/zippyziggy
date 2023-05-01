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
		ObjectMapper mapper = new ObjectMapper();
		String jsonInString = "";
		try {
			jsonInString = mapper.writeValueAsString(memberUuid);
		} catch (JsonProcessingException e) {
			throw new RuntimeException(e);
		}

		kafkaTemplate.send(topic, jsonInString);
		log.info("Kafka Producer sent data from the Order microservice: " + memberUuid);

		return memberUuid;
	}
}

