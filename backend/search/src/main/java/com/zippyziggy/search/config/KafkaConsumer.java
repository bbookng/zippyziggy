package com.zippyziggy.search.config;

import com.zippyziggy.search.dto.response.server.PromptCntResponse;
import javax.transaction.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zippyziggy.search.dto.response.server.SyncEsPrompt;
import com.zippyziggy.search.dto.response.server.SyncEsTalk;
import com.zippyziggy.search.exception.CustomJsonProcessingException;
import com.zippyziggy.search.service.EsPromptService;

import com.zippyziggy.search.service.EsTalkService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Transactional
@Service
@Slf4j
public class KafkaConsumer {

	private final EsPromptService esPromptService;
	private final EsTalkService esTalkService;

	private final ObjectMapper objectMapper = new ObjectMapper();

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

	@KafkaListener(topics = "sync-prompt-hit")
	public void modifyHit(String kafkaMessage) {
		try {
			final PromptCntResponse promptCntResponse = objectMapper.readValue(kafkaMessage, PromptCntResponse.class);
			final String promptUuid = promptCntResponse.getPromptUuid();
			final Integer cnt = promptCntResponse.getCnt();
			esPromptService.updateHit(promptUuid, cnt);
		} catch (JsonProcessingException ex) {
			throw new CustomJsonProcessingException();
		}
	}

	@KafkaListener(topics = "sync-prompt-like-cnt")
	public void modifyLikeCnt(String kafkaMessage) {
		log.info("Kafka Message: ->" + kafkaMessage);
		try {
			final PromptCntResponse promptCntResponse = objectMapper.readValue(kafkaMessage, PromptCntResponse.class);
			final String promptUuid = promptCntResponse.getPromptUuid();
			final Integer cnt = promptCntResponse.getCnt();
			esPromptService.updateLikeCnt(promptUuid, cnt);
		} catch (JsonProcessingException ex) {
			ex.printStackTrace();
			throw new CustomJsonProcessingException();
		}
	}

	@KafkaListener(topics = "create-talk-topic")
	public void createTalk(String kafkaMessage) {
		log.info("Kafka Message: ->" + kafkaMessage);

		try {
			SyncEsTalk syncEsTalk = objectMapper.readValue(kafkaMessage, SyncEsTalk.class);
			log.info("syncEsPrompt: ->" + syncEsTalk);
			esTalkService.insertDocument(syncEsTalk);
		} catch (JsonProcessingException ex) {
			throw new CustomJsonProcessingException();
		}
	}

	@KafkaListener(topics = "delete-talk-topic")
	public void removeTalk(String kafkaMessage) {
		log.info("Kafka Message: ->" + kafkaMessage);
		esTalkService.deleteDocument(Long.valueOf(kafkaMessage));
	}

	//TODO Talk 조회수랑 좋아요수 업데이트

}

