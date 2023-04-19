package com.zippyziggy.member.controller;

import com.amazonaws.services.s3.AmazonS3Client;
import com.zippyziggy.member.dto.request.MemberSignUpRequestDto;
import com.zippyziggy.member.dto.response.*;
import com.zippyziggy.member.model.JwtResponse;
import com.zippyziggy.member.model.JwtToken;
import com.zippyziggy.member.model.Member;
import com.zippyziggy.member.model.Platform;
import com.zippyziggy.member.repository.MemberRepository;
import com.zippyziggy.member.service.*;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import springfox.documentation.annotations.ApiIgnore;

import java.util.List;
import java.util.Optional;
import java.util.UUID;


@RestController
@RequestMapping("/members")
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class MemberController {

    private final KakaoLoginService kakaoLoginService;
    private final GoogleLoginService googleLoginService;
    private final JwtProviderService jwtProviderService;
    private final MemberService memberService;
    private final MemberRepository memberRepository;
    private final JwtValidationService jwtValidationService;
    private final S3Service s3Service;

    @GetMapping("/test")
    @Operation(summary = "서버 테스트용", description = "문자로 리턴해준다")
    public String test() {
        return "test";
    }


    // 인가 코드(인증)를 받고 로직을 실행시킴
    @GetMapping("/auth/kakao/callback")
    @Transactional
    @Operation(summary = "카카오 로그인", description = "기존 회원이면 로그인 성공(refreshToken은 쿠키, accessToken은 헤더에 담긴다), 아닐시 회원가입 요청(isMember : true)가 body에 포함된다")
    public ResponseEntity<?> kakaoCallback(String code) throws Exception {
        // kakao Token 가져오기(권한)
        String kakaoAccessToken = kakaoLoginService.kakaoGetToken(code);

        // Token으로 사용자 정보 가져오기
        KakaoUserInfoResponseDto kakaoUserInfo = kakaoLoginService.kakaoGetProfile(kakaoAccessToken);

        // 기존 회원인지 검증
        String platformId = kakaoUserInfo.getId();
        Member member = memberService.memberCheck(Platform.KAKAO, platformId);

        // DB에 해당 유저가 없다면 회원가입 진행, 없으면 로그인 진행
        // 회원가입을 위해서 일단 프런트로 회원 정보를 넘기고 회원가입 페이지로 넘어가게 해야 할 듯
        if (member == null || member.getActivate().equals(false)) {
            // 회원가입 요청 메세지
            SocialSignUpResponseDto socialSignUpResponseDto = SocialSignUpResponseDto.builder()
                    .name(kakaoUserInfo.getProperties().getNickname())
                    .isMember(true)
                    .profileImg(kakaoUserInfo.getProperties().getProfile_image())
                    .platform(Platform.KAKAO)
                    .platformId(kakaoUserInfo.getId())
                    .build();

            return new ResponseEntity<>(socialSignUpResponseDto, HttpStatus.OK);
        }

        // Jwt 토큰 생성
        JwtToken jwtToken = jwtProviderService.createJwtToken(member.getUserUuid(), member.getNickname());

        member.setRefreshToken(jwtToken.getRefreshToken());

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", jwtToken.getAccessToken());

        // refreshToken Cookie에 담기
        ResponseCookie responseCookie = ResponseCookie.from("refreshToken", jwtToken.getRefreshToken())
                .httpOnly(true)
//                .secure(true) //https 설정 후 연결
                .sameSite("Lax")
                .build();

        // 로그인 시 최소한의 유저 정보 전달
        MemberInformResponseDto memberInformResponseDto = MemberInformResponseDto.builder()
                .nickname(member.getNickname())
                .profileImg(member.getProfileImg())
                .userUuid(member.getUserUuid()).build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, responseCookie.toString())
                .headers(headers)
                .body(memberInformResponseDto);
    }


    @GetMapping("/login/oauth2/code/google")
    @Transactional
    @Operation(summary = "구글 로그인", description = "기존 회원이면 로그인 성공(refreshToken은 쿠키, accessToken은 헤더에 담긴다), 아닐시 회원가입 요청(isMember : true)가 body에 포함된다")
    public ResponseEntity<?> googleCallback(@RequestParam(value="code", required = false) String code) throws Exception {

        GoogleTokenResponseDto token = googleLoginService.googleGetToken(code);

        GoogleUserInfoResponseDto googleProfile = googleLoginService.googleGetProfile(token.getAccess_token());

        String platformId = googleProfile.getId();

        Member member = memberService.memberCheck(Platform.GOOGLE, platformId);

        // DB에 해당 유저가 없다면 회원가입 진행, 없으면 로그인 진행
        // 회원가입을 위해서 일단 프런트로 회원 정보를 넘기고 회원가입 페이지로 넘어가게 해야 할 듯
        if (member == null || member.getActivate().equals(false)) {
            // 회원가입 요청 메세지
            SocialSignUpResponseDto socialSignUpResponseDto = SocialSignUpResponseDto.builder()
                    .name(googleProfile.getName())
                    .isMember(true)
                    .profileImg(googleProfile.getPicture())
                    .platform(Platform.GOOGLE)
                    .platformId(googleProfile.getId())
                    .build();

            return new ResponseEntity<>(socialSignUpResponseDto, HttpStatus.OK);
        }

        // Jwt 토큰 생성
        JwtToken jwtToken = jwtProviderService.createJwtToken(member.getUserUuid(), member.getNickname());

        member.setRefreshToken(jwtToken.getRefreshToken());

        // AccessToken Header에 담기
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", jwtToken.getAccessToken());

        // refreshToken Cookie 생성(각종 보안 설정)
        ResponseCookie responseCookie = ResponseCookie.from("refreshToken", jwtToken.getRefreshToken())
                .httpOnly(true)
//                .secure(true)
                .sameSite("Lax")
                .build();

        // 로그인 시 최소한의 유저 정보 전달
        MemberInformResponseDto memberInformResponseDto = MemberInformResponseDto.builder()
                .nickname(member.getNickname())
                .profileImg(member.getProfileImg())
                .userUuid(member.getUserUuid()).build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, responseCookie.toString())
                .headers(headers)
                .body(memberInformResponseDto);
    }

    /**
     * 로그아웃
     */
    @PostMapping(value = "/logout", headers = "Authorization")
    @Transactional
    @Operation(summary = "로그아웃", description = "refreshToken DB에서 제거, 유효하지 않은 토큰일 경우 에러 발생")
    public ResponseEntity<?> logout(@RequestHeader HttpHeaders headers) throws Exception {
        String accessToken = headers.get("authorization").get(0).replace("Bearer ", "");

        try {
            // token 유효성 검사
            jwtValidationService.validateAccessToken(accessToken);

            // 해당 유저 refreshToken 제거
            Member member = jwtValidationService.findMemberByJWT(accessToken);
            member.setRefreshToken(null);

            // Kakao 계정도 함께 로그아웃 진행
            if (member.getPlatform().equals(Platform.KAKAO)) {
                kakaoLoginService.KakaoLogout();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("토큰이 유효하지 않습니다.");
        }

        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**
     * 회원가입
     * 추후에 사진도 같이 업로드 필요
     */
    @PostMapping("")
    @Transactional
    @Operation(summary = "회원가입", description = "추후 사진 파일 업로드 적용 예정, 현재는 nickname, profileImg, name, platform, platformId 입력 필요" +
            "중복된 유저일 경우 400 상태 코드와 함께 문구가 반환된다.")
    public ResponseEntity<String> memberSignUp(@RequestBody MemberSignUpRequestDto memberSignUpRequestDto) throws Exception {

        try {
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
        } catch (Exception e) {
            System.out.println("e = " + e);
            return new ResponseEntity<>("이미 해당 유저가 존재합니다", HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 회원탈퇴
     */
    @PutMapping(value = "", headers = "Authorization")
    @Transactional
    @Operation(summary = "회원 탈퇴", description = "사용자의 activate를 0으로 변경")
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
     * refresh토큰으로 유효성 검사 진행하고 유효하면 accessToken재발급, 검사 실패시 재로그인 필요
     */
    @PostMapping(value = "/refresh/token", headers = "Authorization")
    @Transactional
    @Operation(summary = "accessToken 재발급", description = "refreshToken을 header에 담아서 요청해야한다. " +
            "refreshToken의 유효성 검사 후 성공이면 accessToken을 재발급해서 헤더에 담아서 보낸다." +
            "만약 만료시간이 지나거나 잘못된 토큰일 경우에는 401에러와 함께 재로그인 문구가 반환된다.")
    public ResponseEntity<?> refreshToken(@RequestHeader HttpHeaders headers) throws Exception {
        String refreshToken = headers.get("authorization").get(0).replace("Bearer ", "");
        JwtResponse jwtResponse = jwtValidationService.validateRefreshToken(refreshToken);

        // 유효하지 않은 refreshToken 요청된 경우
        if (jwtResponse.equals(JwtResponse.REFRESH_TOKEN_MISMATCH) || jwtResponse.equals(JwtResponse.REFRESH_TOKEN_EXPIRED)) {
            return new ResponseEntity<>("유요하지 않은 토큰입니다. 재로그인이 필요합니다", HttpStatus.UNAUTHORIZED);
        } else {
            // refreshToken이 유효한 경우
            Member member = jwtValidationService.findMemberByJWT(refreshToken);
            String accessToken = jwtProviderService.createAccessToken(member.getUserUuid(), member.getNickname());

            HttpHeaders new_headers = new HttpHeaders();
            new_headers.add("Authorization", accessToken);

            return ResponseEntity.ok()
                    .headers(headers)
                    .body("accessToken이 새로 발급되었습니다.");
        }
    }

    /**
     * UUID로 회원 조회하기
     */
    @GetMapping("/uuid/{userUuid}")
    @Operation(summary = "UUID로 회원 조회", description = "UUID를 입력하면 해당하는 회원 정보를 추출할 수 있다.")
    public ResponseEntity<MemberInformResponseDto> findMemberByUUID(UUID userUuid) throws Exception {
        Member member = memberRepository.findByUserUuidEquals(userUuid).get();
        MemberInformResponseDto memberInformResponseDto = MemberInformResponseDto.builder()
                .nickname(member.getNickname())
                .profileImg(member.getProfileImg())
                .userUuid(member.getUserUuid()).build();

        return new ResponseEntity<>(memberInformResponseDto, HttpStatus.OK);
    }

    /**
     * AccessToken으로 회원 조회하기
     */
    @GetMapping("/profile")
    @Operation(summary = "AccessToken으로 내 정보 가져오기", description = "AccessToken을 헤더에 입력하고 요청하면 프로필 정보를 확인할 수 있다.")
    public ResponseEntity<MemberInformResponseDto> findProfile(@RequestHeader HttpHeaders headers) throws Exception {
        String accesstoken = headers.get("authorization").get(0).replace("Bearer ", "");

        Member member = jwtValidationService.findMemberByJWT(accesstoken);
        MemberInformResponseDto memberInformResponseDto = MemberInformResponseDto.builder()
                .nickname(member.getNickname())
                .profileImg(member.getProfileImg())
                .userUuid(member.getUserUuid()).build();

        return new ResponseEntity<>(memberInformResponseDto, HttpStatus.OK);
    }

    /**
     * 회원 정보 수정
     */
    @PutMapping("/profile")
    @Transactional
    @Operation(summary = "회원 정보 수정", description = "닉네임, 프로필 이미지를 변경한다.")
    public ResponseEntity<?> updateProfile(@RequestHeader HttpHeaders headers,
                                           @RequestPart("file") MultipartFile file,
                                           @RequestPart("nickname") String nickname) throws Exception {
        String accesstoken = headers.get("authorization").get(0).replace("Bearer ", "");
        Member member = jwtValidationService.findMemberByJWT(accesstoken);
        member.setNickname(nickname);
        System.out.println("file = " + file);
        System.out.println("nickname = " + nickname);
        System.out.println("member = " + member);

        return new ResponseEntity<>(HttpStatus.OK);

    }

    /**
     * 토큰으로 유저 정보 가져오기
     */
    @GetMapping("/jwt/test")
    @ApiIgnore
    public ResponseEntity<?> totalUser() {

        List<Member> members = memberRepository.findAll();

        for (Member m: members) {
            System.out.println("m = " + m);
            System.out.println("m = " + m.getUserUuid());
        }

        return new ResponseEntity<>(HttpStatus.OK);
    }


    @GetMapping("/jwt/test/{userUuid}")
    @ApiIgnore
    public ResponseEntity<?> jwtTest(@PathVariable String userUuid) {
        UUID uuid = UUID.fromString(userUuid);

        Optional<Member> member = memberRepository.findByUserUuidEquals(uuid);

        JwtToken jwtToken = jwtProviderService.createJwtToken(uuid, member.get().getNickname());

        return new ResponseEntity<>(jwtToken, HttpStatus.OK);
    }

    @GetMapping("/jwt/decode/test/{token}")
    @ApiIgnore
    public ResponseEntity<?> decodeTest(@PathVariable String token) throws Exception {
//        JwtResponse data = jwtValidationService.validateAccessToken(token);
        Member member = jwtValidationService.findMemberByJWT(token);
        JwtResponse jwtResponse = jwtValidationService.validateRefreshToken(token);

        return new ResponseEntity<>(jwtResponse,  HttpStatus.OK);
    }

    @PostMapping("/upload")
    @ApiIgnore
    public ResponseEntity<String> FileUploadController(@RequestPart("file") MultipartFile file) throws Exception {
        String img = s3Service.uploadProfileImg(file);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/image/{fileName}")
    @ApiIgnore
    public ResponseEntity<?> FileUploadImage(@PathVariable String fileName) throws Exception {
        String img = s3Service.findProfileImg(fileName);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
