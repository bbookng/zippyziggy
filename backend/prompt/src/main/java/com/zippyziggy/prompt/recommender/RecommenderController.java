package com.zippyziggy.prompt.recommender;

import com.zippyziggy.prompt.recommender.service.RecommenderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/recommender")
@RequiredArgsConstructor
public class RecommenderController {
    private final RecommenderService recommenderService;

    @GetMapping("/test")
    public ResponseEntity<String> testUploadCsv() throws IOException {
        recommenderService.uploadPromptClickCsv();
        return ResponseEntity.ok("csv 파일이 생성되었습니다.");
    }
}
