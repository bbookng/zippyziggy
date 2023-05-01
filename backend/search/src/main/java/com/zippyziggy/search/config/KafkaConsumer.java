package com.zippyziggy.search.config;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zippyziggy.search.dto.request.server.SyncEsPrompt;
import com.zippyziggy.search.exception.CustomJsonProcessingException;
import com.zippyziggy.search.exception.EsPromptNotFoundException;
import com.zippyziggy.search.repository.EsPromptRepository;
import com.zippyziggy.search.service.EsPromptService;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class KafkaConsumer {
	EsPromptRepository esPromptRepository;
	EsPromptService esPromptService;

	private ObjectMapper objectMapper = new ObjectMapper();

	@Autowired
	public KafkaConsumer(EsPromptRepository esPromptRepository) {
		this.esPromptRepository = esPromptRepository;
	}

	@KafkaListener(topics = "create-prompt-topic")
	public void createPrompt(String kafkaMessage) {
	    log.info("Kafka Message: ->" + kafkaMessage);

		try {
			SyncEsPrompt syncEsPrompt = objectMapper.readValue(kafkaMessage, SyncEsPrompt.class);
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

