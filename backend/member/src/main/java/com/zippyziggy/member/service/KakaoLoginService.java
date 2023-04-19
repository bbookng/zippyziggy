package com.zippyziggy.member.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.zippyziggy.member.dto.response.KakaoTokenResponseDto;
import com.zippyziggy.member.dto.response.KakaoUserInfoResponseDto;
import com.zippyziggy.member.repository.MemberRepository;
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
public class KakaoLoginService {

    // Kakao api key
    @Value("${kakao.client.id}")
    private String kakaoClientId;

    // redirect_url
    @Value("${kakao.redirect.uri}")
    private String kakaoRedirectUri;

    // logout_redirect_url
    @Value("${kakao.logout.redirect.uri}")
    private String kakaoLogoutRedirectUri;

    // json타입을 객체로 변환하기 위한 객체
    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private MemberRepository memberRepository;

    // code를 이용해 kakaoToken 가져오기
    public String kakaoGetToken(String code) throws Exception {

        // 요청 URL
        String kakaoTokenUri = "https://kauth.kakao.com/oauth/token";

        // body
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "authorization_code");
        body.add("client_id", kakaoClientId);
        body.add("redirect_uri", kakaoRedirectUri);
        body.add("code", code);

        System.out.println("body = " + body);

        String token = WebClient.create()
                .post()
                .uri(kakaoTokenUri)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData(body))
                .retrieve()
                .bodyToMono(String.class)
                .timeout(Duration.ofMillis(50000))
                .blockOptional().orElseThrow(
                        () -> new RuntimeException("응답 시간을 초과하였습니다.")
                );

        KakaoTokenResponseDto kakaoTokenResponseDto = objectMapper.readValue(token, KakaoTokenResponseDto.class);

//        System.out.println("kakaoTokenResponseDto = " + kakaoTokenResponseDto);

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
                .timeout(Duration.ofMillis(5000))
                .blockOptional().orElseThrow(
                        () -> new RuntimeException("응답 시간을 초과하였습니다.")
                );

        KakaoUserInfoResponseDto kakaoUserInfoResponseDto = objectMapper.readValue(userInfo, KakaoUserInfoResponseDto.class);
        return kakaoUserInfoResponseDto;
    }


    // 카카오계정과 함께 로그아웃
    public void KakaoLogout() throws Exception {
        String kakaoLogoutUrl = "https://kauth.kakao.com/oauth/logout?client_id=" + kakaoClientId + "&logout_redirect_uri=" + kakaoLogoutRedirectUri;

        WebClient.create()
                .get()
                .uri(kakaoLogoutUrl)
                .retrieve();
    }
}
