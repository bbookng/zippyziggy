package com.zippyziggy.prompt.recommender.service;

import com.zippyziggy.prompt.common.aws.AwsS3Uploader;
import com.zippyziggy.prompt.prompt.client.MemberClient;
import com.zippyziggy.prompt.prompt.model.Prompt;
import com.zippyziggy.prompt.prompt.repository.PromptClickRepository;
import com.zippyziggy.prompt.prompt.repository.PromptRepository;
import com.zippyziggy.prompt.recommender.dto.MahoutPromptClick;
import com.zippyziggy.prompt.recommender.dto.response.MemberIdResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.client.circuitbreaker.CircuitBreaker;
import org.springframework.cloud.client.circuitbreaker.CircuitBreakerFactory;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class RecommenderService {

    private final MemberClient memberClient;
    private final CircuitBreakerFactory circuitBreakerFactory;

    private final PromptRepository promptRepository;
    private final PromptClickRepository promptClickRepository;

    private final AwsS3Uploader awsS3Uploader;

    //TODO 하루에 한 번 배치 실행
    public void uploadPromptClickCsv() throws IOException {
        CircuitBreaker circuitBreaker = circuitBreakerFactory.create("circuitBreaker");
        List<MemberIdResponse> allMemberIds = circuitBreaker.run(() -> memberClient.getAllMemberIds());
        List<Prompt> allPrompts = promptRepository.findAll();

        List<MahoutPromptClick> mahoutPromptClicks = new ArrayList<>();
        for (MemberIdResponse memberIdResponse : allMemberIds) {
            final Long memberId = memberIdResponse.getId();
            final UUID memberUuid = UUID.fromString(memberIdResponse.getMemberUuid());
            for (Prompt prompt : allPrompts) {
                final Long promptId = prompt.getId();
                final Long clickCnt = promptClickRepository.countByMemberUuidAndPromptId(memberUuid, promptId);
                final MahoutPromptClick mahoutPromptClick = new MahoutPromptClick(memberId, promptId, clickCnt);
                mahoutPromptClicks.add(mahoutPromptClick);
            }
        }

        // 로컬 저장 경로
        String localDir = "..\\..\\..\\..\\..\\..\\resources\\";
        try {
            FileWriter fw = new FileWriter(localDir + "mahout-prompt-click.csv");
            log.info("FileWriter 생성");
            BufferedWriter bw = new BufferedWriter(fw);
            log.info("BufferedWriter 생성");
            for (MahoutPromptClick promptClick : mahoutPromptClicks) {
                final Long memberId = promptClick.getMemberId();
                final Long promptId = promptClick.getPromptId();
                final Long clickCnt = promptClick.getClickCnt();

                final String row = memberId + "," + promptId  + "," + clickCnt;
                bw.write(row);
                bw.newLine();
            }
            bw.flush();
            bw.close();
            log.info("csv 작성 완료");
            // S3에 저장
            final String key = "recommender/" + LocalDate.now().toString() + "-mahout-prompt-click.csv";
            awsS3Uploader.uploadCsv(key, new File("..\\..\\..\\..\\..\\..\\resources\\mahout-prompt-click.csv"));
            log.info("S3 저장 완료");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
