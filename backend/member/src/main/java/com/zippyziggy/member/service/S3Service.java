package com.zippyziggy.member.service;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.PutObjectResult;
import com.zippyziggy.member.model.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class S3Service {

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @Value("${cloud.aws.region.static}")
    private String region;


    private final AmazonS3Client amazonS3Client;

    public String uploadProfileImg(UUID userUuid, MultipartFile file) throws Exception {
        String fileName = file.getOriginalFilename();
        String filepath = createS3FileName(fileName, userUuid);

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType(file.getContentType());
        metadata.setContentLength(file.getSize());

        amazonS3Client.putObject(bucket, filepath, file.getInputStream(), metadata);

        String S3Url = "https://" + bucket + ".s3." + region + ".amazonaws.com/" + filepath;

        return S3Url;
    }


    // 파일 이름 및 경로 설정
    private String createS3FileName (String fileName, UUID userUuid) {

        UUID uuid = UUID.randomUUID();
        String newFileUrl = "image/" + userUuid + "/" + fileName + uuid;
        return newFileUrl;
    }


    public void deleteS3File(String fileName) throws Exception {
        String filePath = fileName.replace("https://zippyziggyimage.s3.ap-northeast-2.amazonaws.com/", "");
        boolean isObjectExist = amazonS3Client.doesObjectExist(bucket, filePath);
        System.out.println("isObjectExist = " + isObjectExist);
        if (isObjectExist) {
            System.out.println("여기까지 왔는데요");
            System.out.println("filePath = " + filePath);
            amazonS3Client.deleteObject(bucket, filePath);
        }

    }
}
