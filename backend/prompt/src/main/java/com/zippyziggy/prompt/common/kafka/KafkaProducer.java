package com.zippyziggy.prompt.common.kafka;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zippyziggy.prompt.prompt.dto.request.EsPromptRequest;
import com.zippyziggy.prompt.prompt.dto.request.NoticeRequest;
import com.zippyziggy.prompt.prompt.dto.request.PromptCntRequest;
import com.zippyziggy.prompt.prompt.dto.request.TalkCntRequest;
import com.zippyziggy.prompt.talk.dto.request.EsTalkRequest;
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

    public String sendPromptCnt(String topic, PromptCntRequest promptCntRequest) {
        try {
            String jsonInString = mapper.writeValueAsString(promptCntRequest);
            kafkaTemplate.send(topic, jsonInString);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
        return promptCntRequest.getPromptUuid();
    }

    public EsTalkRequest sendTalkCreateMessage(String topic, EsTalkRequest esTalkRequest) {
        try {
            String jsonInString = mapper.writeValueAsString(esTalkRequest);
            log.info("Kafka Producer sent data from the Order microservice: " + esTalkRequest);
            kafkaTemplate.send(topic, jsonInString);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
        return esTalkRequest;
    }

    public Long sendTalkDeleteMessage(String topic, Long talkId) {
        kafkaTemplate.send(topic, talkId.toString());
        log.info("Kafka Producer sent data from the Order microservice: " + talkId);
        return talkId;
    }

    public Long sendTalkCnt(String topic, TalkCntRequest talkCntRequest) {
        try {
            String jsonInString = mapper.writeValueAsString(talkCntRequest);
            kafkaTemplate.send(topic, jsonInString);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
        return talkCntRequest.getTalkId();
    }

    public NoticeRequest sendNotification(String topic, NoticeRequest data) {
        try {
            String jsonInString = mapper.writeValueAsString(data);
            kafkaTemplate.send(topic, jsonInString);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
        return data.from(data);
    }
}
