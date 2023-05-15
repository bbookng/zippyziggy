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
        log.info("csv 생성에 필요한 db 데이터 불러오기 완료");
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
        log.info("mahout에 사용할 dto로 변환 완료");
        // 임시 경로에 저장
        String tempDir = System.getProperty("java.io.tmpdir");
        log.info("tempDir: ", tempDir.toString());
        File tempFile;
        final String key = "recommender/" + LocalDate.now().toString() + "-mahout-prompt-click.csv";
        try {
            tempFile = File.createTempFile(LocalDate.now().toString().concat("-mahout-prompt-click"), ".csv", new File(tempDir));
            BufferedWriter bw = new BufferedWriter(new FileWriter(tempFile));
            log.info("BufferedWriter 생성");
            for (MahoutPromptClick promptClick : mahoutPromptClicks) {
                final Long memberId = promptClick.getMemberId();
                final Long promptId = promptClick.getPromptId();
                final Long clickCnt = promptClick.getClickCnt();
                final String row = memberId + "," + promptId  + "," + clickCnt;
                bw.write(row);
                bw.newLine();
            }
            log.info("BufferedWriter 쓰기 완료");
            bw.flush();
            log.info("BufferedWriter flush");
            bw.close();
            log.info("BufferedWriter close");
            // S3에 저장
            awsS3Uploader.uploadCsv(key, tempFile);
            log.info("csv 파일 저장 완료");
            tempFile.deleteOnExit();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
