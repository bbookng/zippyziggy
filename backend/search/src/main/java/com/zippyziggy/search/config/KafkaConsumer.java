package com.zippyziggy.search.config;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zippyziggy.search.repository.EsPromptRepository;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class KafkaConsumer {
	EsPromptRepository esPromptRepository;

	@Autowired
	public KafkaConsumer(EsPromptRepository esPromptRepository) {
		this.esPromptRepository = esPromptRepository;
	}

	@KafkaListener(topics = "create-prompt-topic")
	public void createPrompt(String kafkaMessage) {
	    log.info("Kafka Message: ->" + kafkaMessage);

	    Map<Object, Object> map = new HashMap<>();
	    ObjectMapper mapper = new ObjectMapper();

	    try {
	        map = mapper.readValue(kafkaMessage, new TypeReference<Map<Object, Object>>() {
	        });
	    } catch (JsonProcessingException ex) {
	        ex.printStackTrace();
	    }


		//
	    // List<Prompt> prompts = promptRepository.findAllByMemberUuid((UUID) map.get("memberUuid"));
	    // if (prompts != null) {
	    //     prompts.stream().map(prompt -> {promptRepository.delete(prompt);
	    //         return null;
	    //     });
	    // }

	}
}

