package com.zippyziggy.member.controller;

import com.zippyziggy.member.dto.request.MemberSignUpRequestDto;
import com.zippyziggy.member.dto.response.GoogleTokenResponseDto;
import com.zippyziggy.member.dto.response.GoogleUserInfoResponseDto;
import com.zippyziggy.member.dto.response.KakaoUserInfoResponseDto;
import com.zippyziggy.member.dto.response.SocialSignUpResponseDto;
import com.zippyziggy.member.model.Member;
import com.zippyziggy.member.model.Platform;
import com.zippyziggy.member.repository.MemberRepository;
import com.zippyziggy.member.service.GoogleLoginService;
import com.zippyziggy.member.service.KakaoLoginService;
import com.zippyziggy.member.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/members")
public class MemberController {

    @Autowired
    private KakaoLoginService kakaoLoginService;

    @Autowired
    private GoogleLoginService googleLoginService;

    @Autowired
    private MemberService memberService;

    @Autowired
    private MemberRepository memberRepository;

    @GetMapping("/test")
    public String test() {
        return "test";
    }


    // 인가 코드(인증)를 받고 로직을 실행시킴
    @GetMapping("/auth/kakao/callback")
    @Operation(summary = "카카오 로그인", description = "기존 회원이면 로그인 성공, 아닐시 회원가입 요청 -> 프런트에서는 사용X")
    public ResponseEntity<?> kakaoCallback(String code) throws Exception {

        // kakao Token 가져오기(권한)
        String kakaoAccessToken = kakaoLoginService.kakaoGetToken(code);

        // Token으로 사용자 정보 가져오기
        KakaoUserInfoResponseDto kakaoUserInfo = kakaoLoginService.kakaoGetProfile(kakaoAccessToken);

        // 기존 회원인지 검증
        String platformId = kakaoUserInfo.getId();
        boolean memberCheck = memberService.memberCheck(Platform.KAKAO, platformId);

        // DB에 해당 유저가 없다면 회원가입 진행, 없으면 로그인 진행
        // 회원가입을 위해서 일단 프런트로 회원 정보를 넘기고 회원가입 페이지로 넘어가게 해야 할 듯
        if (memberCheck) {
            // 회원가입 요청 메세지
            SocialSignUpResponseDto.builder()
                    .name(kakaoUserInfo.getProperties().getNickname())
                    .profileImg(kakaoUserInfo.getProperties().getProfile_image())
                    .platform(Platform.KAKAO)
                    .platformId(kakaoUserInfo.getId())
                    .build();
            return new ResponseEntity<>(kakaoUserInfo, HttpStatus.NO_CONTENT);
        }

        // 로그인 처리 진행(아마 JWT?)
        return new ResponseEntity<>(kakaoUserInfo, HttpStatus.OK);
    }


    @GetMapping("/login/oauth2/code/google")
    @Operation(summary = "구글 로그인", description = "기존 회원이 아니면 회원가입, 그 외에는 로그인 -> 프런트 관련 X")
    public ResponseEntity<?> googleCallback(@RequestParam(value="code", required = false) String code) throws Exception {

        GoogleTokenResponseDto token = googleLoginService.googleGetToken(code);

        GoogleUserInfoResponseDto googleProfile = googleLoginService.googleGetProfile(token.getAccess_token());

        String platformId = googleProfile.getId();

        boolean memberCheck = memberService.memberCheck(Platform.GOOGLE, platformId);

        // DB에 해당 유저가 없다면 회원가입 진행, 없으면 로그인 진행
        // 회원가입을 위해서 일단 프런트로 회원 정보를 넘기고 회원가입 페이지로 넘어가게 해야 할 듯
        if (memberCheck) {
            // 회원가입 요청 메세지
            SocialSignUpResponseDto socialSignUpResponseDto = SocialSignUpResponseDto.builder()
                    .name(googleProfile.getName())
                    .profileImg(googleProfile.getPicture())
                    .platform(Platform.GOOGLE)
                    .platformId(googleProfile.getId())
                    .build();

            return new ResponseEntity<>(socialSignUpResponseDto, HttpStatus.NO_CONTENT);
        }

        return new ResponseEntity<>(googleProfile, HttpStatus.OK);
    }


    @GetMapping("/logout")
    public ResponseEntity<Long> logout() {

//        String kakaoLogoutUrl = "https://kauth.kakao.com/oauth/logout?client_id=${REST_API_KEY}&logout_redirect_uri=${LOGOUT_REDIRECT_URI}"

        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**
     * 추후에 사진도 같이 업로드 필요
     */
    // 회원가입
    @PostMapping("")
    @Operation(summary = "회원가입", description = "추후 사진 파일 업로드 적용 예정, 현재는 nickname, profileImg, name, platform, platformId 입력 필요")
    public ResponseEntity<String> memberSignUp(@RequestBody MemberSignUpRequestDto memberSignUpRequestDto) throws Exception {

        memberService.memberSignUp(memberSignUpRequestDto);

        return new ResponseEntity<>("회원가입 완료", HttpStatus.OK);
    }

    // 닉네임 중복 검사
    @GetMapping("/nickname/{nickname}")
    @Operation(summary = "닉네임 중복 검사", description = "중복된 닉네임 존재 시 true반환, 중복된 닉네임이 존재하지 않으면 false 반환")
    public ResponseEntity<?> nicknameCheck(@PathVariable String nickname) throws Exception {
        boolean execute = memberService.nicknameCheck(nickname);
        return new ResponseEntity<>(execute, HttpStatus.OK);
    }


}
