package com.zippyziggy.member.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.zippyziggy.member.dto.response.GoogleTokenResponseDto;
import com.zippyziggy.member.dto.response.GoogleUserInfoResponseDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;

@Service
public class GoogleLoginService {

    @Value("${google.client.id}")
    private String googleClientId;

    @Value("${google.secret.key}")
    private String googleSecretKey;

    @Autowired
    private ObjectMapper objectMapper;

    public GoogleTokenResponseDto googleGetToken(String code, String redirectUrl) throws Exception{

        String googleTokenUrl = "https://oauth2.googleapis.com/token";

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("code", code);
        body.add("client_id", googleClientId);
        body.add("client_secret", googleSecretKey);
        body.add("redirect_uri", redirectUrl);
        body.add("grant_type", "authorization_code");

        String token = WebClient.create()
                .post()
                .uri(googleTokenUrl)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .accept(MediaType.APPLICATION_JSON)
                .body(BodyInserters.fromFormData(body))
                .retrieve()
                .bodyToMono(String.class)
                .timeout(Duration.ofMillis(50000))
                .blockOptional().orElseThrow(
                        () -> new RuntimeException("응답 시간을 초과하였습니다.")
                );


        return objectMapper.readValue(token, GoogleTokenResponseDto.class);
    }

    public GoogleUserInfoResponseDto googleGetProfile(String googleAccessToken) throws Exception {

        String googleProfileUrl = "https://www.googleapis.com/oauth2/v1/userinfo";

        System.out.println("googleAccessToken = " + googleAccessToken);

        String googleProfile = WebClient.create()
                .get()
                .uri(googleProfileUrl)
                .header("Authorization", "Bearer " + googleAccessToken)
                .retrieve()
                .bodyToMono(String.class)
                .timeout(Duration.ofMillis(50000))
                .blockOptional().orElseThrow(
                        () -> new RuntimeException("응답 시간을 초과하였습니다.")
                );

        return objectMapper.readValue(googleProfile, GoogleUserInfoResponseDto.class);
    }

}
