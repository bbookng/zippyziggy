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

@Service
@Slf4j
public class KafkaProducer {

    private KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    public KafkaProducer(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public EsPromptRequest send(String topic, EsPromptRequest promptCreateDto) {
        ObjectMapper mapper = new ObjectMapper();
        String jsonInString = "";
        try {
            jsonInString = mapper.writeValueAsString(promptCreateDto);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

        kafkaTemplate.send(topic, jsonInString);
        log.info("Kafka Producer sent data from the Order microservice: " + promptCreateDto);

        return promptCreateDto;
    }

    public String sendDeleteMessage(String topic, String promptUuid) {

        kafkaTemplate.send(topic, promptUuid);
        log.info("Kafka Producer sent data from the Order microservice: " + promptUuid);

        return promptUuid;
    }
}
