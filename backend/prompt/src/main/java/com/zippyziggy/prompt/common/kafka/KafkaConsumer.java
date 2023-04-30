package com.zippyziggy.prompt.common.kafka;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zippyziggy.prompt.prompt.model.Prompt;
import com.zippyziggy.prompt.prompt.repository.PromptRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Slf4j
public class KafkaConsumer {
    PromptRepository promptRepository;

    @Autowired
    public KafkaConsumer(PromptRepository promptRepository) {
        this.promptRepository = promptRepository;
    }

    @KafkaListener(topics = "delete-member-topic")
    public void deleteMember(String kafkaMessage) {
        log.info("Kafka Message: ->" + kafkaMessage);

        Map<Object, Object> map = new HashMap<>();
        ObjectMapper mapper = new ObjectMapper();

        try {
            map = mapper.readValue(kafkaMessage, new TypeReference<Map<Object, Object>>() {
            });
        } catch (JsonProcessingException ex) {
            ex.printStackTrace();
        }

        List<Prompt> prompts = promptRepository.findAllByMemberUuid((UUID) map.get("memberUuid"));
        if (prompts != null) {
            prompts.stream().map(prompt -> {promptRepository.delete(prompt);
                return null;
            });
        }

    }
}
