package com.zippyziggy.search.config;

import javax.transaction.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zippyziggy.search.dto.request.server.SyncEsPrompt;
import com.zippyziggy.search.exception.CustomJsonProcessingException;
import com.zippyziggy.search.repository.EsPromptRepository;
import com.zippyziggy.search.service.EsPromptService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Transactional
@Service
@Slf4j
public class KafkaConsumer {

	private final EsPromptService esPromptService;

	private ObjectMapper objectMapper = new ObjectMapper();

	@KafkaListener(topics = "create-prompt-topic")
	public void createPrompt(String kafkaMessage) {
	    log.info("Kafka Message: ->" + kafkaMessage);

		try {
			SyncEsPrompt syncEsPrompt = objectMapper.readValue(kafkaMessage, SyncEsPrompt.class);
			log.info("syncEsPrompt: ->" + syncEsPrompt);
			esPromptService.insertDocument(syncEsPrompt);
		} catch (JsonProcessingException ex) {
			throw new CustomJsonProcessingException();
		}
	}

	@KafkaListener(topics = "update-prompt-topic")
	public void modifyPrompt(String kafkaMessage) {
		log.info("Kafka Message: ->" + kafkaMessage);

		try {
			SyncEsPrompt syncEsPrompt = objectMapper.readValue(kafkaMessage, SyncEsPrompt.class);
			String promptUuid = String.valueOf(syncEsPrompt.getPromptUuid());
			esPromptService.updateDocument(promptUuid, syncEsPrompt);
		} catch (JsonProcessingException ex) {
			throw new CustomJsonProcessingException();
		}
	}

	@KafkaListener(topics = "delete-prompt-topic")
	public void removePrompt(String kafkaMessage) {
		log.info("Kafka Message: ->" + kafkaMessage);
		esPromptService.deleteDocument(kafkaMessage);

	}
}

