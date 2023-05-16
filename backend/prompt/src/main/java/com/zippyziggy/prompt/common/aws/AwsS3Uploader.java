package com.zippyziggy.prompt.common.aws;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.PutObjectRequest;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Log4j2
@RequiredArgsConstructor
@Component
public class AwsS3Uploader {

	private final AmazonS3Client amazonS3Client;

	@Value("zippyziggy")
	public String bucket;

	public String upload(MultipartFile multipartFile, String dirName) {
		try {
			File uploadFile = convert(multipartFile)        // 파일 생성
					.orElseThrow(() -> new IllegalArgumentException("MultipartFile -> File convert fail"));
			return upload(uploadFile, dirName);
		}catch (IOException e){
			e.printStackTrace();
			throw new RuntimeException();
		}
	}

	public String upload(File uploadFile, String dirName) {
		String fileName = dirName + "/" + UUID.randomUUID() + uploadFile.getName();
		String uploadImageUrl = putS3(uploadFile, fileName);    // s3로 업로드
		removeNewFile(uploadFile);
		return uploadImageUrl;
	}

	// 1. 로컬에 파일생성
	private Optional<File> convert(MultipartFile file) throws IOException {
		File convertFile = new File(file.getOriginalFilename());
		if (convertFile.createNewFile()) {
			try (FileOutputStream fos = new FileOutputStream(convertFile)) {
				fos.write(file.getBytes());
			}
			return Optional.of(convertFile);
		}

		return Optional.empty();
	}

	// 2. S3에 파일업로드
	private String putS3(File uploadFile, String fileName) {
		amazonS3Client.putObject(new PutObjectRequest(bucket, fileName, uploadFile).withCannedAcl(
				CannedAccessControlList.PublicRead));
		log.info("File Upload : " + fileName);
		return amazonS3Client.getUrl(bucket, fileName).toString();
	}

	// 3. 로컬에 생성된 파일삭제
	private void removeNewFile(File targetFile) {
		if (targetFile.delete()) {
			log.info("File delete success");
			return;
		}
		log.info("File delete fail");
	}


	public void delete(String directory, String path) {
		String[] split = path.split("/");
		String fileName = split[split.length - 1];

		log.info("File Delete : " + directory + "/" + fileName);
		amazonS3Client.deleteObject(bucket, directory + "/" + fileName);
	}

	public void uploadCsv(String key, File file) {
		amazonS3Client.putObject(bucket, key, file);
	}

	public void downloadCsv(String key) {
		// Create a GetObjectRequest specifying the bucket name and object key
		GetObjectRequest getObjectRequest = new GetObjectRequest(bucket, key);

		// Create a file object
		File file = new File("mahout-prompt-click.csv");
		try {
			if (file.createNewFile()) {
				log.info("File created");
			} else {
				log.info("File already exists");
			}
		} catch (IOException e) {
			e.printStackTrace();
		}

		// Call the getObject() method to retrieve the S3 object and save it to the file
		amazonS3Client.getObject(getObjectRequest, file);
		log.info("S3 object has been successfully converted to a file.");
	}
}
