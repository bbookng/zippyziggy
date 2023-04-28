package com.zippyziggy.member.controller;

import com.amazonaws.services.s3.AmazonS3Client;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zippyziggy.member.config.CustomModelMapper;
import com.zippyziggy.member.dto.request.MemberSignUpRequestDto;
import com.zippyziggy.member.dto.response.*;
import com.zippyziggy.member.exception.MemberNotFoundException;
import com.zippyziggy.member.model.JwtResponse;
import com.zippyziggy.member.model.JwtToken;
import com.zippyziggy.member.model.Member;
import com.zippyziggy.member.model.Platform;
import com.zippyziggy.member.repository.MemberRepository;
import com.zippyziggy.member.service.*;
//import com.zippyziggy.member.util.RedisUtils;
import com.zippyziggy.member.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.security.SecurityScheme;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.http.*;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;


@RestController
@RequestMapping("/members")
@RequiredArgsConstructor
@Transactional
public class MemberController {

    private final KakaoLoginService kakaoLoginService;
    private final GoogleLoginService googleLoginService;
    private final JwtProviderService jwtProviderService;
    private final MemberService memberService;
    private final MemberRepository memberRepository;
    private final JwtValidationService jwtValidationService;
    private final SecurityUtil securityUtil;

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI().components(new Components().addSecuritySchemes("bearer-key",
            new SecurityScheme().type(SecurityScheme.Type.HTTP).scheme("bearer").bearerFormat("JWT")));
    }

//    /**
//     * SecurityContext 테스트
//     */
//    @GetMapping("/test/userUtil")
//    @Operation(hidden = true)
//    public void testUserUtil() throws Exception {
//        Member member = securityUtil.getCurrentMember();
//    }
//
//    /**
//     * 유저 자동 저장
//     */
//    @GetMapping("/save/user")
//    @Operation(hidden = true)
//    public void saveUser() throws Exception {
//
//        // 요청 URL
//        String signUpUrl = "http://localhost:8080/members/signup";
//
//
//        for (int i = 5000; i < 50000; i++) {
//            MemberSignUpRequestDto memberSignUpRequestDto = MemberSignUpRequestDto.builder()
//                    .name("name")
//                    .platform(Platform.KAKAO)
//                    .platformId(Integer.toString(i))
//                    .profileImg("image")
//                    .nickname(Integer.toString(i)).build();
//            MultipartFile file = null;
//            memberService.memberSignUp(memberSignUpRequestDto, file);
//
//        }
//    }

    /**
     * 카카오 로그인
     */
    @GetMapping("/auth/kakao/callback")
    @Operation(summary = "카카오 로그인", description = "기존 회원이면 로그인 성공(refreshToken은 쿠키, accessToken은 헤더에 담긴다), 아닐시 회원가입 요청(isSignUp : true)가 body에 포함된다")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "500", description = "서버 에러")
    })
    public ResponseEntity<?> kakaoCallback(String code, @RequestParam(value = "redirect") String redirectUrl,HttpServletRequest request, HttpServletResponse response) throws Exception {

        // kakao Token 가져오기(권한)
        String kakaoAccessToken = kakaoLoginService.kakaoGetToken(code, redirectUrl);

        // Token으로 사용자 정보 가져오기
        KakaoUserInfoResponseDto kakaoUserInfo = kakaoLoginService.kakaoGetProfile(kakaoAccessToken);

        // 기존 회원인지 검증
        String platformId = kakaoUserInfo.getId();
        Member member = memberService.memberCheck(Platform.KAKAO, platformId);


        // DB에 해당 유저가 없다면 회원가입 진행, 없으면 로그인 진행
        // 회원가입을 위해서 일단 프런트로 회원 정보를 넘기고 회원가입 페이지로 넘어가게 해야 할 듯
        if (member == null || member.getActivate().equals(false)) {
            // 회원가입 요청 메세지
            SocialSignUpDataResponseDto socialSignUpDataResponseDto = SocialSignUpDataResponseDto.builder()
                    .name(kakaoUserInfo.getProperties().getNickname())
                    .profileImg(kakaoUserInfo.getProperties().getProfile_image())
                    .platform(Platform.KAKAO)
                    .platformId(kakaoUserInfo.getId()).build();

            SocialSignUpResponseDto socialSignUpResponseDto = SocialSignUpResponseDto.builder()
                    .isSignUp(true)
                    .socialSignUpDataResponseDto(socialSignUpDataResponseDto)
                    .build();

            return new ResponseEntity<>(socialSignUpResponseDto, HttpStatus.OK);
        }

        // Jwt 토큰 생성
        JwtToken jwtToken = jwtProviderService.createJwtToken(member.getUserUuid());

        member.setRefreshToken(jwtToken.getRefreshToken());

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", jwtToken.getAccessToken());
        headers.add("Access-Control-Expose-Headers", "Authorization");


        // 기존 쿠키 제거
        Cookie[] myCookies = request.getCookies();
        if (myCookies != null) {
            for (Cookie myCookie : myCookies) {
                System.out.println("myCookie 쿠키!!!!!!= " + myCookie);
                if (myCookie.getName().equals("refreshToken") || myCookie.getName().equals("accessToken")) {
                    myCookie.setMaxAge(0);
                    response.addCookie(myCookie);
                }
            }
        }

        // 쿠키 설정
        ResponseCookie cookie = ResponseCookie.from("refreshToken", jwtToken.getRefreshToken())
                .path("/")
                .sameSite("None")
                .httpOnly(true)
                .secure(true)
                .maxAge(60 * 60 * 24 * 14)
                .build();

        response.setHeader("Access-Control-Allow-Origin", request.getHeader("Origin"));
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.addHeader("Set-Cookie", cookie.toString());


        // 로그인 시 최소한의 유저 정보 전달
        MemberInformResponseDto memberInformResponseDto = MemberInformResponseDto.builder()
                .nickname(member.getNickname())
                .profileImg(member.getProfileImg())
                .userUuid(member.getUserUuid()).build();



        ///////////////////////////////레디스/////////////////////////////////
        // 기존에 있던 redis 정보 삭제
//        String MemberKey = "member" + member.getUserUuid();
//        String RefreshKey = "refreshToken" + member.getUserUuid();
//
//        if (redisUtils.isExists(MemberKey)) {
//            redisUtils.delete(MemberKey);
//        }
//
//        if (redisUtils.isExists(RefreshKey)) {
//            redisUtils.delete(RefreshKey);
//        }
//
//        // redis 설정(1. 유저 정보 저장 -> UUID나 AccessToken으로 회원 조회할 시 활용
//        //           2. refreshToken 저장 -> accessToken 만료 시 DB가 아닌 Redis에서 먼저 찾아오기)
//
//        // 유저 정보 Redis에 저장
//        redisUtils.put(MemberKey, memberInformResponseDto, 60 * 60 * 24 * 14L); // refreshToken의 만료시간과 동일하게 설정
//        MemberInformResponseDto dto = redisUtils.get(MemberKey, MemberInformResponseDto.class);
//        long expireTime = redisUtils.getExpireTime(MemberKey);
//
//        // RefreshToken Redis에 저장
//        redisUtils.put(RefreshKey, jwtToken.getRefreshToken(), 60 * 60 * 24 * 14L);
//        String redisRefreshToken = redisUtils.get(RefreshKey, String.class);
//        long refreshExpireTime = redisUtils.getExpireTime(RefreshKey);
//
//        System.out.println("Redis dto 결과 = " + dto);
//        System.out.println("Redis expireTime 결과 = " + expireTime);
//        System.out.println("redisRefreshToken = " + redisRefreshToken);
//        System.out.println("refreshExpireTime = " + refreshExpireTime);
        ///////////////////////////////레디스/////////////////////////////////



        return ResponseEntity.ok()
                .headers(headers)
                .body(memberInformResponseDto);
    }

    /**
     * 구글 로그인
     */
    @GetMapping("/login/oauth2/code/google")
    @Operation(summary = "구글 로그인", description = "기존 회원이면 로그인 성공(refreshToken은 쿠키, accessToken은 헤더에 담긴다), 아닐시 회원가입 요청(isMember : true)가 body에 포함된다")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "500", description = "서버 에러")
    })
    public ResponseEntity<?> googleCallback(@RequestParam(value="code", required = false) String code, @RequestParam(value = "redirect") String redirectUrl, HttpServletRequest request, HttpServletResponse response) throws Exception {

        GoogleTokenResponseDto token = googleLoginService.googleGetToken(code, redirectUrl);

        GoogleUserInfoResponseDto googleProfile = googleLoginService.googleGetProfile(token.getAccess_token());

        String platformId = googleProfile.getId();

        Member member = memberService.memberCheck(Platform.GOOGLE, platformId);

        // DB에 해당 유저가 없다면 회원가입 진행, 없으면 로그인 진행
        // 회원가입을 위해서 일단 프런트로 회원 정보를 넘기고 회원가입 페이지로 넘어가게 해야 할 듯
        if (member == null || member.getActivate().equals(false)) {
            // 회원가입 요청 메세지
            SocialSignUpDataResponseDto socialSignUpDataResponseDto = SocialSignUpDataResponseDto.builder()
                    .name(googleProfile.getName())
                    .profileImg(googleProfile.getPicture())
                    .platform(Platform.GOOGLE)
                    .platformId(googleProfile.getId()).build();

            SocialSignUpResponseDto socialSignUpResponseDto = SocialSignUpResponseDto.builder()
                    .isSignUp(true)
                    .socialSignUpDataResponseDto(socialSignUpDataResponseDto)
                    .build();

            return new ResponseEntity<>(socialSignUpResponseDto, HttpStatus.OK);
        }

        // Jwt 토큰 생성
        JwtToken jwtToken = jwtProviderService.createJwtToken(member.getUserUuid());

        member.setRefreshToken(jwtToken.getRefreshToken());

        // AccessToken Header에 담기
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", jwtToken.getAccessToken());
        headers.add("Access-Control-Expose-Headers", "Authorization");

        // 기존 쿠키 제거
        Cookie[] myCookies = request.getCookies();
        if (myCookies != null) {
            for (Cookie myCookie : myCookies) {
                if (myCookie.getName().equals("refreshToken") || myCookie.getName().equals("accessToken")) {
                    myCookie.setMaxAge(0);
                    response.addCookie(myCookie);
                }
            }
        }

        // 쿠키 설정
//        Cookie cookie = new Cookie("refreshToken", jwtToken.getRefreshToken());
//        cookie.setHttpOnly(true);
//        cookie.setSecure(true);
//        cookie.setMaxAge(60 * 60 * 24 * 14);

        ResponseCookie cookie = ResponseCookie.from("refreshToken", jwtToken.getRefreshToken())
                .path("/")
                .sameSite("None")
                .httpOnly(true)
                .secure(true)
                .maxAge(60 * 60 * 24 * 14)
                .build();

        response.setHeader("Access-Control-Allow-Origin", request.getHeader("Origin"));
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.addHeader("Set-Cookie", cookie.toString());

        // 로그인 시 최소한의 유저 정보 전달
        MemberInformResponseDto memberInformResponseDto = MemberInformResponseDto.builder()
                .nickname(member.getNickname())
                .profileImg(member.getProfileImg())
                .userUuid(member.getUserUuid()).build();

        ///////////////////////////////레디스/////////////////////////////////
//        // 기존에 있던 redis 정보 삭제
//        String MemberKey = "member" + member.getUserUuid();
//        String RefreshKey = "refreshToken" + member.getUserUuid();
//
//        if (redisUtils.isExists(MemberKey)) {
//            redisUtils.delete(MemberKey);
//        }
//
//        if (redisUtils.isExists(RefreshKey)) {
//            redisUtils.delete(RefreshKey);
//        }
//
//        // redis 설정(1. 유저 정보 저장 -> UUID나 AccessToken으로 회원 조회할 시 활용
//        //           2. refreshToken 저장 -> accessToken 만료 시 DB가 아닌 Redis에서 먼저 찾아오기)
//
//        // 유저 정보 Redis에 저장
//        redisUtils.put(MemberKey, memberInformResponseDto, 60 * 60 * 24 * 14L); // refreshToken의 만료시간과 동일하게 설정
//        MemberInformResponseDto dto = redisUtils.get(MemberKey, MemberInformResponseDto.class);
//        long expireTime = redisUtils.getExpireTime(MemberKey);
//
//        // RefreshToken Redis에 저장
//        redisUtils.put(RefreshKey, jwtToken.getRefreshToken(), 60 * 60 * 24 * 14L);
//        String redisRefreshToken = redisUtils.get(RefreshKey, String.class);
//        long refreshExpireTime = redisUtils.getExpireTime(RefreshKey)
//
//        System.out.println("Redis dto 결과 = " + dto);
//        System.out.println("Redis expireTime 결과 = " + expireTime);
//        System.out.println("redisRefreshToken = " + redisRefreshToken);
//        System.out.println("refreshExpireTime = " + refreshExpireTime);
        ///////////////////////////////레디스/////////////////////////////////

        return ResponseEntity.ok()
//                .header(HttpHeaders.SET_COOKIE, responseCookie.toString())
                .headers(headers)
                .body(memberInformResponseDto);
    }

    /**
     * 로그아웃
     */
    @PostMapping(value = "/logout", headers = "Authorization")
    @Operation(summary = "로그아웃(Authorization 필요)", description = "refreshToken DB에서 제거, 유효하지 않은 토큰일 경우 에러 발생")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "500", description = "서버 에러")
    })

    public ResponseEntity<?> logout(@RequestParam(value = "redirect", required = false) String redirectUrl ,HttpServletRequest request, HttpServletResponse response) throws Exception {

        // 기존 유저 찾아온 후 refreshToken 제거
        Member member = securityUtil.getCurrentMember();
        member.setRefreshToken(null);

        // 기존에 있던 redis 정보 삭제
//        String MemberKey = "member" + member.getUserUuid();
//        String RefreshKey = "refreshToken" + member.getUserUuid();
//
//        if (redisUtils.isExists(MemberKey)) {
//            redisUtils.delete(MemberKey);
//        }
//
//        if (redisUtils.isExists(RefreshKey)) {
//            redisUtils.delete(RefreshKey);
//        }


        // Kakao 계정도 함께 로그아웃 진행
        if (member.getPlatform().equals(Platform.KAKAO)) {
            kakaoLoginService.KakaoLogout(redirectUrl);
        }

        // 기존 쿠키 제거
        Cookie[] myCookies = request.getCookies();
        if (myCookies != null) {
            for (Cookie myCookie : myCookies) {
                if (myCookie.getName().equals("refreshToken") || myCookie.getName().equals("accessToken")) {
                    myCookie.setMaxAge(0);
                    response.addCookie(myCookie);
                }
            }
        }

        return new ResponseEntity<>("로그아웃 완료" ,HttpStatus.OK);
    }

    /**
     * 회원가입
     * 추후에 사진도 같이 업로드 필요
     */
    @PostMapping("/signup")
    @Operation(summary = "회원가입", description = "추후 사진 파일 업로드 적용 예정, 현재는 nickname, profileImg, name, platform, platformId 입력 필요" +
            "중복된 유저일 경우 400 상태 코드와 함께 문구가 반환된다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "500", description = "서버 에러")
    })
    public ResponseEntity<?> memberSignUp(@RequestPart(value = "user") MemberSignUpRequestDto memberSignUpRequestDto,
                                          @RequestPart(value = "file", required = false) MultipartFile file, HttpServletRequest request, HttpServletResponse response) throws Exception {
        try {
            JwtToken jwtToken = memberService.memberSignUp(memberSignUpRequestDto, file);
            HttpHeaders headers = new HttpHeaders();
            headers.add("Authorization", jwtToken.getAccessToken());
            headers.add("Access-Control-Expose-Headers", "Authorization");


            // 기존 쿠키 제거
            Cookie[] myCookies = request.getCookies();
            if (myCookies != null) {
                for (Cookie myCookie : myCookies) {
                    if (myCookie.getName().equals("refreshToken") || myCookie.getName().equals("accessToken")) {
                        myCookie.setMaxAge(0);
                        response.addCookie(myCookie);
                    }
                }
            }

            // 쿠키 설정
            Cookie cookie = new Cookie("refreshToken", jwtToken.getRefreshToken());
            cookie.setHttpOnly(true);
            cookie.setSecure(true);
            cookie.setMaxAge(60 * 60 * 24 * 14);

            response.setHeader("Access-Control-Allow-Origin", request.getHeader("Origin"));
            response.setHeader("Access-Control-Allow-Credentials", "true");
            response.addCookie(cookie);

            Member member = jwtValidationService.findMemberByJWT(jwtToken.getAccessToken());
            MemberInformResponseDto memberInformResponseDto = MemberInformResponseDto.builder()
                    .nickname(member.getNickname())
                    .profileImg(member.getProfileImg())
                    .userUuid(member.getUserUuid()).build();

            MemberSignUpResponseDto memberSignUpResponseDto = MemberSignUpResponseDto.builder()
                    .isSignUp(false)
                    .memberInformResponseDto(memberInformResponseDto).build();

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(memberSignUpResponseDto);

        } catch (Exception e) {

            System.out.println("e = " + e);
            return new ResponseEntity<>("회원가입 도중 오류가 발생했습니다 => " + e, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 회원탈퇴
     */
    @PutMapping(value = "", headers = "Authorization")
    @Operation(summary = "회원 탈퇴(Authorization 필요)", description = "사용자의 activate를 0으로 변경, 닉네임도 빈 문자열로 변경")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "500", description = "서버 에러")
    })
    public ResponseEntity<?> memberSignOut(HttpServletRequest request, HttpServletResponse response) throws Exception {

        memberService.memberSignOut();

        // 기존 쿠키 제거
        Cookie[] myCookies = request.getCookies();
        if (myCookies != null) {
            for (Cookie myCookie : myCookies) {
                if (myCookie.getName().equals("refreshToken") || myCookie.getName().equals("accessToken")) {
                    myCookie.setMaxAge(0);
                    response.addCookie(myCookie);
                }
            }
        }

        return new ResponseEntity<>("회원 탈퇴 완료",HttpStatus.OK);
    }

    /**
     * 닉네임 중복 검사
     */
    @GetMapping("/nickname/{nickname}")
    @Operation(summary = "닉네임 중복 검사", description = "중복된 닉네임 존재 시 true반환, 중복된 닉네임이 존재하지 않으면 false 반환")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "500", description = "서버 에러")
    })
    public ResponseEntity<Boolean> nicknameCheck(@PathVariable String nickname) throws Exception {
        boolean execute = memberService.nicknameCheck(nickname);
        return new ResponseEntity<>(execute, HttpStatus.OK);
    }


    /**
     * refresh토큰으로 유효성 검사 진행하고 유효하면 accessToken재발급, 검사 실패시 재로그인 필요
     */
    @PostMapping(value = "/refresh/token")
    @Operation(summary = "accessToken 재발급", description = "쿠키에 담긴 refreshToken확인 " +
            "refreshToken의 유효성 검사 후 성공이면 accessToken을 재발급해서 헤더에 담아서 보낸다." +
            "만약 만료시간이 지나거나 잘못된 토큰일 경우에는 401에러와 함께 재로그인 문구가 반환된다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "500", description = "서버 에러")
    })
    public ResponseEntity<?> refreshToken(HttpServletRequest request, HttpServletResponse response) {

        try {
            // 기존 쿠키 확인해서 refreshToken 검증진행
            Cookie[] myCookies = request.getCookies();
            if (myCookies != null) {
                for (Cookie myCookie : myCookies) {
                    if (myCookie.getName().equals("refreshToken")) {
                        String value = myCookie.getValue();
                        System.out.println("value = 여기닷@@@@@@@" + value);
                        jwtValidationService.validateRefreshToken(value);
                    }
                }
            }
        } catch (TokenExpiredException e) {
            return new ResponseEntity<>("Refresh Token이 만료되었습니다", HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            return new ResponseEntity<>("Refresh Token이 유효하지 않습니다", HttpStatus.UNAUTHORIZED);
        }


        // 기존 유저 찾아오기
        Member member = securityUtil.getCurrentMember();
        String accessToken = jwtProviderService.createAccessToken(member.getUserUuid());
        System.out.println("accessToken = 꺄울!!!!!!!" + accessToken);
        HttpHeaders new_headers = new HttpHeaders();
        new_headers.add("Authorization", accessToken);

        return ResponseEntity.ok()
                .headers(new_headers)
                .body("accessToken이 새로 발급되었습니다.");
    }


    /**
     * UUID로 회원 조회하기
     */
    @GetMapping("/uuid")
    @Operation(summary = "UUID로 회원 조회", description = "UUID를 쿼리스트링으로 입력(userUuid)하면 해당하는 회원 정보를 추출할 수 있다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "500", description = "서버 에러")
    })
    public ResponseEntity<MemberInformResponseDto> findMemberByUUID(@RequestParam UUID userUuid) throws Exception {

//        if (redisUtils.isExists("member" + userUuid)) {
//            System.out.println("redis 실행");
//            MemberInformResponseDto memberInformResponseDto = redisUtils.get("member" + userUuid, MemberInformResponseDto.class);
//            return new ResponseEntity<>(memberInformResponseDto, HttpStatus.OK);
//        } else {
//            System.out.println("DB 실행");
            Member member = memberRepository.findByUserUuid(userUuid).orElseThrow(MemberNotFoundException::new);

            MemberInformResponseDto memberInformResponseDto = MemberInformResponseDto.builder()
                    .nickname(member.getNickname())
                    .profileImg(member.getProfileImg())
                    .userUuid(member.getUserUuid()).build();
            return new ResponseEntity<>(memberInformResponseDto, HttpStatus.OK);
//        }
        }



    /**
     * AccessToken으로 회원 정보 조회하기
     */
    @GetMapping("/profile")
    @Operation(summary = "AccessToken으로 내 정보 가져오기(Authorization 필요)", description = "AccessToken을 헤더에 입력하고 요청하면 프로필 정보를 확인할 수 있다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "500", description = "서버 에러")
    })
    public ResponseEntity<MemberInformResponseDto> findProfile() throws Exception {

        // 기존 유저 찾아오기
        Member member = securityUtil.getCurrentMember();

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
    @Operation(summary = "회원 정보 수정(Authorization 필요)", description = "닉네임, 프로필 이미지를 변경한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "500", description = "서버 에러")
    })
    public ResponseEntity<?> updateProfile(@RequestPart(value = "file", required = false) MultipartFile file,
                                           @RequestPart("nickname") String nickname) throws Exception {

        // 기존 유저 찾아오기
        Member member = securityUtil.getCurrentMember();

        System.out.println("file = " + file);

        // 회원 정보 수정
        Member updateMember = memberService.updateProfile(nickname, file, member);

        MemberInformResponseDto memberInformResponseDto = MemberInformResponseDto.builder()
                .nickname(updateMember.getNickname())
                .profileImg(updateMember.getProfileImg())
                .userUuid(updateMember.getUserUuid()).build();

        return new ResponseEntity<>(memberInformResponseDto, HttpStatus.OK);
    }

    @GetMapping("/uuid/{uuid}")
    public ResponseEntity<?> test(@PathVariable UUID uuid) {
        Optional<Member> byUserUuidEquals = memberRepository.findByUserUuid(uuid);
        System.out.println("byUserUuidEquals = 움하하" + byUserUuidEquals);

        return new ResponseEntity<>(HttpStatus.OK);
    }

}
