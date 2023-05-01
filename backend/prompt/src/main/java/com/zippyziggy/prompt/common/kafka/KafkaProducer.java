package com.zippyziggy.prompt.common.kafka;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.JacksonYAMLParseException;
import com.zippyziggy.prompt.prompt.dto.request.EsPromptRequest;
import com.zippyziggy.prompt.prompt.dto.response.PromptResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Slf4j
@Service
@Transactional
public class KafkaProducer {

    private KafkaTemplate<String, String> kafkaTemplate;
    private ObjectMapper mapper = new ObjectMapper();
    @Autowired
    public KafkaProducer(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public EsPromptRequest send(String topic, EsPromptRequest promptCreateDto) {

        try {
            String jsonInString = mapper.writeValueAsString(promptCreateDto);
            log.info("Kafka Producer sent data from the Order microservice: " + promptCreateDto);
            kafkaTemplate.send(topic, jsonInString);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
        return promptCreateDto;
    }

    public String sendDeleteMessage(String topic, String promptUuid) {

        kafkaTemplate.send(topic, promptUuid);
        log.info("Kafka Producer sent data from the Order microservice: " + promptUuid);

        return promptUuid;
    }
}
