package com.zippyziggy.member.service;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectResult;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class S3Service {

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @Value("${cloud.aws.region.static}")
    private String region;

    private final AmazonS3Client amazonS3Client;

    public String uploadProfileImg(MultipartFile file) throws Exception {
        String fileName = file.getOriginalFilename();
        String fileUrl = "https://" + bucket + "/image" + fileName;

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType(file.getContentType());
        metadata.setContentLength(file.getSize());

        PutObjectResult putObjectResult = amazonS3Client.putObject(bucket, fileName, file.getInputStream(), metadata);
        System.out.println("putObjectResult = " + putObjectResult);
        return null;
    }

    public String findProfileImg(String fileName) throws Exception {
        String S3Url = "https://" + bucket + ".s3." + region + ".amazonaws.com/" + fileName;

    }
}
