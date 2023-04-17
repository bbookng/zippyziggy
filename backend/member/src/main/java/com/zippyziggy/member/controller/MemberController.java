package com.zippyziggy.member.controller;

import com.zippyziggy.member.dto.response.GoogleTokenResponseDto;
import com.zippyziggy.member.dto.response.GoogleUserInfoResponseDto;
import com.zippyziggy.member.dto.response.KakaoUserInfoResponseDto;
import com.zippyziggy.member.model.Member;
import com.zippyziggy.member.model.Platform;
import com.zippyziggy.member.repository.MemberRepository;
import com.zippyziggy.member.service.GoogleLoginService;
import com.zippyziggy.member.service.KakaoLoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/members")
public class MemberController {

    @Autowired
    private KakaoLoginService kakaoLoginService;

    @Autowired
    private GoogleLoginService googleLoginService;

    @Autowired
    private MemberRepository memberRepository;

    @GetMapping("/test")
    public String test() {
        return "test";
    }


    // 인가 코드(인증)를 받고 로직을 실행시킴
    @GetMapping("/auth/kakao/callback")
    public String kakaoCallback(String code) throws Exception {

        // kakao Token 가져오기(권한)
        String kakaoAccessToken = kakaoLoginService.kakaoGetToken(code);

        // Token으로 사용자 정보 가져오기
        KakaoUserInfoResponseDto kakaoUserInfo = kakaoLoginService.kakaoGetProfile(kakaoAccessToken);

        Long platformId = kakaoUserInfo.getId();
        Optional<Member> member = memberRepository.findByPlatformAndPlatformId(Platform.KAKAO, platformId);

        // DB에 해당 유저가 없다면 회원가입 진행, 없으면 로그인 진행
        // 회원가입을 위해서 일단 프런트로 회원 정보를 넘기고 회원가입 페이지로 넘어가게 해야 할 듯
        if (member.isEmpty()) {
            return "해당되는 유저가 없습니다";
        }

        // 로그인 처리 진행(아마 JWT?)

        return kakaoUserInfo.toString();
    }


    @GetMapping("/logout")
    public ResponseEntity<Long> logout() {

//        String kakaoLogoutUrl = "https://kauth.kakao.com/oauth/logout?client_id=${REST_API_KEY}&logout_redirect_uri=${LOGOUT_REDIRECT_URI}"

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/login/oauth2/code/google")
    public String googleCallback(@RequestParam(value="code", required = false) String code) throws Exception {
        GoogleTokenResponseDto token = googleLoginService.googleGetToken(code);

        GoogleUserInfoResponseDto googleProfile = googleLoginService.googleGetProfile(token.getAccess_token());



        return googleProfile.toString();
    }


}
