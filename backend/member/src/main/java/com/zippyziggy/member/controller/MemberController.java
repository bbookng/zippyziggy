package com.zippyziggy.member.controller;

import com.zippyziggy.member.dto.request.MemberSignUpRequestDto;
import com.zippyziggy.member.dto.response.GoogleTokenResponseDto;
import com.zippyziggy.member.dto.response.GoogleUserInfoResponseDto;
import com.zippyziggy.member.dto.response.KakaoUserInfoResponseDto;
import com.zippyziggy.member.dto.response.SocialSignUpResponseDto;
import com.zippyziggy.member.model.JwtResponse;
import com.zippyziggy.member.model.JwtToken;
import com.zippyziggy.member.model.Member;
import com.zippyziggy.member.model.Platform;
import com.zippyziggy.member.repository.MemberRepository;
import com.zippyziggy.member.service.*;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;


@RestController
@RequestMapping("/members")
@Transactional(readOnly = true)
public class MemberController {

    @Autowired
    private KakaoLoginService kakaoLoginService;

    @Autowired
    private GoogleLoginService googleLoginService;

    @Autowired
    private JwtProviderService jwtProviderService;

    @Autowired
    private MemberService memberService;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private JwtValidationService jwtValidationService;

    @GetMapping("/test")
    public String test() {
        return "test";
    }


    // 인가 코드(인증)를 받고 로직을 실행시킴
    @GetMapping("/auth/kakao/callback")
    @Transactional
    @Operation(summary = "카카오 로그인", description = "기존 회원이면 로그인 성공, 아닐시 회원가입 요청 -> 프런트에서는 사용X")
    public ResponseEntity<?> kakaoCallback(String code) throws Exception {

        // kakao Token 가져오기(권한)
        String kakaoAccessToken = kakaoLoginService.kakaoGetToken(code);

        // Token으로 사용자 정보 가져오기
        KakaoUserInfoResponseDto kakaoUserInfo = kakaoLoginService.kakaoGetProfile(kakaoAccessToken);

        // 기존 회원인지 검증
        String platformId = kakaoUserInfo.getId();
        Member member = memberService.memberCheck(Platform.KAKAO, platformId);
        System.out.println("kakaoUserInfo = " + kakaoUserInfo);
        // DB에 해당 유저가 없다면 회원가입 진행, 없으면 로그인 진행
        // 회원가입을 위해서 일단 프런트로 회원 정보를 넘기고 회원가입 페이지로 넘어가게 해야 할 듯
        if (member == null) {
            // 회원가입 요청 메세지
            SocialSignUpResponseDto socialSignUpResponseDto = SocialSignUpResponseDto.builder()
                    .name(kakaoUserInfo.getProperties().getNickname())
                    .profileImg(kakaoUserInfo.getProperties().getProfile_image())
                    .platform(Platform.KAKAO)
                    .platformId(kakaoUserInfo.getId())
                    .build();

            return new ResponseEntity<>(socialSignUpResponseDto, HttpStatus.NO_CONTENT);
        }

        // Jwt 토큰 생성
        JwtToken jwtToken = jwtProviderService.createJwtToken(member.getUserUuid(), member.getNickname());

        member.setRefreshToken(jwtToken.getRefreshToken());

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", jwtToken.getAccessToken());

        ResponseCookie responseCookie = ResponseCookie.from("refreshToken", jwtToken.getRefreshToken())
                .httpOnly(true)
                .secure(true)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, responseCookie.toString())
                .headers(headers)
                .body(null);
    }


    @GetMapping("/login/oauth2/code/google")
    @Transactional
    @Operation(summary = "구글 로그인", description = "기존 회원이 아니면 회원가입, 그 외에는 로그인 -> 프런트 관련 X")
    public ResponseEntity<?> googleCallback(@RequestParam(value="code", required = false) String code) throws Exception {

        GoogleTokenResponseDto token = googleLoginService.googleGetToken(code);

        GoogleUserInfoResponseDto googleProfile = googleLoginService.googleGetProfile(token.getAccess_token());

        String platformId = googleProfile.getId();

        Member member = memberService.memberCheck(Platform.GOOGLE, platformId);

        // DB에 해당 유저가 없다면 회원가입 진행, 없으면 로그인 진행
        // 회원가입을 위해서 일단 프런트로 회원 정보를 넘기고 회원가입 페이지로 넘어가게 해야 할 듯
        if (member == null) {
            // 회원가입 요청 메세지
            SocialSignUpResponseDto socialSignUpResponseDto = SocialSignUpResponseDto.builder()
                    .name(googleProfile.getName())
                    .profileImg(googleProfile.getPicture())
                    .platform(Platform.GOOGLE)
                    .platformId(googleProfile.getId())
                    .build();

            return new ResponseEntity<>(socialSignUpResponseDto, HttpStatus.NO_CONTENT);
        }

        // Jwt 토큰 생성
        JwtToken jwtToken = jwtProviderService.createJwtToken(member.getUserUuid(), member.getNickname());

        member.setRefreshToken(jwtToken.getRefreshToken());

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", jwtToken.getAccessToken());

        ResponseCookie responseCookie = ResponseCookie.from("refreshToken", jwtToken.getRefreshToken())
                .httpOnly(true)
                .secure(true)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, responseCookie.toString())
                .headers(headers)
                .body(null);
    }

    /**
     * 로그아웃
     */
    @PostMapping(value = "/logout", headers = "Authorization")
    @Transactional
    @Operation(summary = "로그아웃", description = "refreshToken DB에서 제거, 유효하지 않은 토큰일 경우 에러 발생")
    public ResponseEntity<?> logout(@RequestHeader HttpHeaders headers) throws Exception {
//        System.out.println("headers = " + headers);
        String accessToken = headers.get("authorization").get(0).replace("Bearer ", "");

        JwtResponse jwtResponse = jwtValidationService.validateAccessToken(accessToken);
        if (jwtResponse == JwtResponse.ACCESS_TOKEN_MISMATCH) {
            return ResponseEntity.badRequest().body("토큰이 유효하지 않습니다.");
        } else {
            Member member = jwtValidationService.findMemberByJWT(accessToken);
            member.setRefreshToken(null);
            if (member.getPlatform().equals(Platform.KAKAO)) {
                kakaoLoginService.KakaoLogout();
            }
        }

        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**
     * 회원가입
     * 추후에 사진도 같이 업로드 필요
     */
    @PostMapping("")
    @Transactional
    @Operation(summary = "회원가입", description = "추후 사진 파일 업로드 적용 예정, 현재는 nickname, profileImg, name, platform, platformId 입력 필요")
    public ResponseEntity<String> memberSignUp(@RequestBody MemberSignUpRequestDto memberSignUpRequestDto) throws Exception {

        JwtToken jwtToken = memberService.memberSignUp(memberSignUpRequestDto);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", jwtToken.getAccessToken());

        ResponseCookie responseCookie = ResponseCookie.from("refreshToken", jwtToken.getRefreshToken())
                .httpOnly(true)
                .secure(true)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, responseCookie.toString())
                .headers(headers)
                .body(null);
    }

    /**
     * 회원탈퇴
     */
    @PutMapping(value = "", headers = "Authorization")
    @Transactional
    public ResponseEntity<?> memberSignOut(@RequestHeader HttpHeaders headers) throws Exception {
        String accessToken = headers.get("authorization").get(0).replace("Bearer ", "");
        JwtResponse jwtResponse = jwtValidationService.validateAccessToken(accessToken);

        if (jwtResponse == JwtResponse.ACCESS_TOKEN_MISMATCH) {
            return ResponseEntity.badRequest().body("토큰이 유효하지 않습니다.");
        } else {
            memberService.memberSignOut(accessToken);
            return new ResponseEntity<>(HttpStatus.OK);
        }
    }

    /**
     * 닉네임 중복 검사
     */
    @GetMapping("/nickname/{nickname}")
    @Operation(summary = "닉네임 중복 검사", description = "중복된 닉네임 존재 시 true반환, 중복된 닉네임이 존재하지 않으면 false 반환")
    public ResponseEntity<Boolean> nicknameCheck(@PathVariable String nickname) throws Exception {
        boolean execute = memberService.nicknameCheck(nickname);
        return new ResponseEntity<>(execute, HttpStatus.OK);
    }

    /**
     * 토큰으로 유저 정보 가져오기
     */
    @GetMapping("/jwt/test/")
    public ResponseEntity<?> totalUser() {

        List<Member> members = memberRepository.findAll();

        for (Member m: members) {
            System.out.println("m = " + m);
            System.out.println("m = " + m.getUserUuid());
        }

        return new ResponseEntity<>(HttpStatus.OK);
    }


    @GetMapping("/jwt/test/{userUuid}")
    public ResponseEntity<?> jwtTest(@PathVariable String userUuid) {
        UUID uuid = UUID.fromString(userUuid);

        Optional<Member> member = memberRepository.findByUserUuidEquals(uuid);

        JwtToken jwtToken = jwtProviderService.createJwtToken(uuid, member.get().getNickname());

        return new ResponseEntity<>(jwtToken, HttpStatus.OK);
    }

    @GetMapping("/jwt/decode/test/{token}")
    public ResponseEntity<?> decodeTest(@PathVariable String token) throws Exception {
        JwtResponse data = jwtValidationService.validateAccessToken(token);
        Member member = jwtValidationService.findMemberByJWT(token);
        return new ResponseEntity<>(member,  HttpStatus.OK);
    }


}
