package com.zippyziggy.prompt.recommender.service;

import com.zippyziggy.prompt.recommender.dto.MahoutPromptClick;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.util.ArrayList;
import java.util.List;
import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.mahout.cf.taste.impl.model.file.FileDataModel;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class RecommenderService {

    // 하루에 한 번 배치 실행, PromptClick.csv 파일 생성, S3에 저장
    public void writePromptClickCsv() {
        List<MahoutPromptClick> mahoutPromptClicks = new ArrayList<>();

//        BufferedWriter bw = new BufferedWriter(new FileWriter("MahoutPromptClick.csv", true));
//        for (MahoutPromptClick promptClick : mahoutPromptClicks) {
//            String userId = mahout.getUserId();
//            String goodsId = mahout.goodsId();
//            String row = userId.hashCode() + "," + goodsId.hashCode()  + "," + mahout.getPurchaseCount();
//            users.put(userId.hashCode(), userId);
//            goods.put(goodsId.hashCode(), goodsId);
//            bw.write(row);
//            bw.newLine();
//        }
//        bw.flush();
//        bw.close();
    }

}
