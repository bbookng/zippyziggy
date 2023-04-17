package com.zippyziggy.member.controller;

import com.zippyziggy.member.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/members")
public class LogoutController {

    // Kakao api key
    @Value("${kakao.client.id}")
    private String kakaoClientId;

    @Value("${kakao.logout.redirect.uri}")
    private String kakaoLogoutRedirectUri;

    @Autowired
    private MemberRepository memberRepository;

    @GetMapping("/logout")
    public ResponseEntity<Long> logout() {

        String kakaoLogoutUrl = "https://kauth.kakao.com/oauth/logout?client_id=${REST_API_KEY}&logout_redirect_uri=${LOGOUT_REDIRECT_URI}"

        return new ResponseEntity<>(HttpStatus.OK);
    }
}
