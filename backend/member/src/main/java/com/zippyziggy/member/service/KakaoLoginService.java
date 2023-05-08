package com.zippyziggy.member.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.zippyziggy.member.dto.response.KakaoTokenResponseDto;
import com.zippyziggy.member.dto.response.KakaoUserInfoResponseDto;
import com.zippyziggy.member.repository.MemberRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;

@Slf4j
@Service
public class KakaoLoginService {

    // Kakao api key
    @Value("${kakao.client.id}")
    private String kakaoClientId;

    // json타입을 객체로 변환하기 위한 객체
    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private MemberRepository memberRepository;

    // code를 이용해 kakaoToken 가져오기
    public String kakaoGetToken(String code, String redirectUrl) throws Exception {
        log.debug("4444444444444444444444444444444");
        // 요청 URL
        String kakaoTokenUri = "https://kauth.kakao.com/oauth/token";
        log.debug("55555555555555555555555555555555");
        // body
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "authorization_code");
        body.add("client_id", kakaoClientId);
        body.add("redirect_uri", redirectUrl);
        body.add("code", code);
        log.debug("66666666666666666666666666666");
        // 카카오에 token 요청
        String token = WebClient.create()
                .post()
                .uri(kakaoTokenUri)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData(body))
                .retrieve()
                .bodyToMono(String.class)
                .timeout(Duration.ofMillis(5000000))
                .blockOptional().orElseThrow(
                        () -> new RuntimeException("응답 시간을 초과하였습니다.")
                );
        log.debug("777777777777777777777777777777777777");
        // 객체로 전환
        KakaoTokenResponseDto kakaoTokenResponseDto = objectMapper.readValue(token, KakaoTokenResponseDto.class);
        log.debug("888888888888888888888888888888888888");
        return kakaoTokenResponseDto.getAccess_token();
    }


    // 토큰을 사용하여 사용자 정보 가져오기
    public KakaoUserInfoResponseDto kakaoGetProfile(String kakaoAccessToken) throws Exception {

        // URL
        String kakaoUserInfoUrl = "https://kapi.kakao.com/v2/user/me";

        String userInfo = WebClient.create()
                .post()
                .uri(kakaoUserInfoUrl)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .header("Authorization", "Bearer " + kakaoAccessToken)
                .retrieve()
                .bodyToMono(String.class)
                .timeout(Duration.ofMillis(500000))
                .blockOptional().orElseThrow(
                        () -> new RuntimeException("응답 시간을 초과하였습니다.")
                );

        return objectMapper.readValue(userInfo, KakaoUserInfoResponseDto.class);
    }


    // 카카오계정과 함께 로그아웃
    public void KakaoLogout(String redirectUrl) throws Exception {
        String kakaoLogoutUrl = "https://kauth.kakao.com/oauth/logout?client_id=" + kakaoClientId + "&logout_redirect_uri=" + redirectUrl;

        WebClient.create()
                .get()
                .uri(kakaoLogoutUrl)
                .retrieve();
    }
}
