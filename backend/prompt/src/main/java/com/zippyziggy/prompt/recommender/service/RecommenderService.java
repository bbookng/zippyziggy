package com.zippyziggy.prompt.recommender.service;

import com.zippyziggy.prompt.common.aws.AwsS3Uploader;
import com.zippyziggy.prompt.prompt.client.MemberClient;
import com.zippyziggy.prompt.prompt.model.Prompt;
import com.zippyziggy.prompt.prompt.model.StatusCode;
import com.zippyziggy.prompt.prompt.repository.PromptClickRepository;
import com.zippyziggy.prompt.prompt.repository.PromptRepository;
import com.zippyziggy.prompt.recommender.dto.MahoutPromptClick;
import com.zippyziggy.prompt.recommender.dto.response.MemberIdResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.mahout.cf.taste.common.TasteException;
import org.apache.mahout.cf.taste.impl.model.file.FileDataModel;
import org.apache.mahout.cf.taste.impl.recommender.GenericItemBasedRecommender;
import org.apache.mahout.cf.taste.impl.recommender.GenericUserBasedRecommender;
import org.apache.mahout.cf.taste.impl.similarity.LogLikelihoodSimilarity;
import org.apache.mahout.cf.taste.impl.similarity.PearsonCorrelationSimilarity;
import org.apache.mahout.cf.taste.recommender.RecommendedItem;
import org.apache.mahout.cf.taste.similarity.UserSimilarity;
import org.apache.mahout.cf.taste.impl.neighborhood.ThresholdUserNeighborhood;
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
        List<Prompt> allOpenPrompts = promptRepository.findByStatusCode(StatusCode.OPEN);

        List<MahoutPromptClick> mahoutPromptClicks = new ArrayList<>();
        for (MemberIdResponse memberIdResponse : allMemberIds) {
            final Long memberId = memberIdResponse.getId();
            final UUID memberUuid = UUID.fromString(memberIdResponse.getMemberUuid());
            for (Prompt prompt : allOpenPrompts) {
                final Long promptId = prompt.getId();
                final Long clickCnt = promptClickRepository.countByMemberUuidAndPromptId(memberUuid, promptId);
                final MahoutPromptClick mahoutPromptClick = new MahoutPromptClick(memberId, promptId, clickCnt);
                mahoutPromptClicks.add(mahoutPromptClick);
            }
        }

        File csvFile = new File("mahout-prompt-click.csv");
        try {
            if (csvFile.createNewFile()) {
                log.info("File created");
            } else {
                log.info("File already exists");
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        try {
            FileWriter fw = new FileWriter(csvFile, false);
            BufferedWriter bw = new BufferedWriter(fw);
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
            log.info("csv 생성 완료");

            // S3에 저장
            final String key = "recommender/" + LocalDate.now().toString() + "-mahout-prompt-click.csv";
            awsS3Uploader.uploadCsv(key, new File("mahout-prompt-click.csv"));
            log.info("csv S3 저장 완료");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public List<Long> userBasedRecommend(Long memberId) {
        FileDataModel dm;
        try {
            final String key = "recommender/" + LocalDate.now().minusDays(1).toString() + "-mahout-prompt-click.csv";
            awsS3Uploader.downloadCsv(key);
            dm = new FileDataModel(new File("mahout-prompt-click.csv"));
            log.info("FileDataModel\n" + dm.toString());
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }

        UserSimilarity user;
        try {
            user = new PearsonCorrelationSimilarity(dm);
            log.info("피어슨상관계수\n" + user.toString());
        } catch (TasteException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }

        ThresholdUserNeighborhood nh = new ThresholdUserNeighborhood(0.1, user, dm);
        GenericUserBasedRecommender recommender = new GenericUserBasedRecommender(dm, nh, user);
        log.info("ThresholdUserNeighborhood\n" + nh.toString());
        log.info("recommender" + recommender.toString());

        List<RecommendedItem> recommend;
        try {
            recommend = recommender.recommend(memberId, 10);
            log.info("recommend\n" + recommend.toString());
            log.info("recommend size\n" + String.valueOf(recommend.size()));
        } catch (TasteException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }

        List<Long> promptIds = new ArrayList<>();
        for (RecommendedItem item : recommend) {
            Long promptId = item.getItemID();
            promptIds.add(promptId);
        }
        log.info("promptIds\n" + promptIds.toString());

        return promptIds;
    }


    public List<Long> itemBasedRecommend(Long memberId) {
        FileDataModel dm;
        try {
            final String key = "recommender/" + LocalDate.now().minusDays(1).toString() + "-mahout-prompt-click.csv";
            awsS3Uploader.downloadCsv(key);
            dm = new FileDataModel(new File("mahout-prompt-click.csv"));
            log.info("FileDataModel\n" + dm.toString());
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }

        LogLikelihoodSimilarity sim = new LogLikelihoodSimilarity(dm);
        GenericItemBasedRecommender recommender = new GenericItemBasedRecommender(dm, sim);

        List<RecommendedItem> recommend;
        try {
            recommend = recommender.recommend(memberId, 10);
        } catch (TasteException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }

        List<Long> promptIds = new ArrayList<>();
        for (RecommendedItem item : recommend) {
            Long promptId = item.getItemID();
            promptIds.add(promptId);
        }

        return promptIds;
    }

}
