package com.zippyziggy.member.controller;

import com.auth0.jwt.exceptions.TokenExpiredException;
import com.zippyziggy.member.client.PromptClient;
import com.zippyziggy.member.dto.request.MemberSignUpRequestDto;
import com.zippyziggy.member.dto.response.DailyVisitedCount;
import com.zippyziggy.member.dto.response.GoogleTokenResponseDto;
import com.zippyziggy.member.dto.response.GoogleUserInfoResponseDto;
import com.zippyziggy.member.dto.response.KakaoUserInfoResponseDto;
import com.zippyziggy.member.dto.response.MemberInformResponseDto;
import com.zippyziggy.member.dto.response.MemberResponse;
import com.zippyziggy.member.dto.response.MemberSignUpResponseDto;
import com.zippyziggy.member.dto.response.MemberTalkList;
import com.zippyziggy.member.dto.response.PromptCardListResponse;
import com.zippyziggy.member.dto.response.PromptCardResponse;
import com.zippyziggy.member.dto.response.SocialSignUpDataResponseDto;
import com.zippyziggy.member.dto.response.SocialSignUpResponseDto;
import com.zippyziggy.member.dto.response.TotalVisitedCount;
import com.zippyziggy.member.model.JwtToken;
import com.zippyziggy.member.model.Member;
import com.zippyziggy.member.model.Platform;
import com.zippyziggy.member.model.VisitedMemberCount;
import com.zippyziggy.member.repository.MemberRepository;
import com.zippyziggy.member.repository.VisitedMemberCountRepository;
import com.zippyziggy.member.service.GoogleLoginService;
import com.zippyziggy.member.service.JwtProviderService;
import com.zippyziggy.member.service.JwtValidationService;
import com.zippyziggy.member.service.KakaoLoginService;
import com.zippyziggy.member.service.MemberService;
import com.zippyziggy.member.service.RedisService;
import com.zippyziggy.member.service.VisitedMemberCountService;
import com.zippyziggy.member.util.CookieUtils;
import com.zippyziggy.member.util.RedisUtils;
import com.zippyziggy.member.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.security.SecurityScheme;
import java.util.List;
import java.util.UUID;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequestMapping("/members")
@RequiredArgsConstructor
@Slf4j
@Transactional
public class MemberController {

    private final KakaoLoginService kakaoLoginService;
    private final GoogleLoginService googleLoginService;
    private final JwtProviderService jwtProviderService;
    private final MemberService memberService;
    private final JwtValidationService jwtValidationService;
    private final RedisService redisService;
    private final VisitedMemberCountService visitedMemberCountService;
    private final VisitedMemberCountRepository visitedMemberCountRepository;

    private final PromptClient promptClient;

    private final SecurityUtil securityUtil;
    private final RedisUtils redisUtils;
    private final CookieUtils cookieUtils;

    private final MemberRepository memberRepository;

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI().components(new Components().addSecuritySchemes("bearer-key",
            new SecurityScheme().type(SecurityScheme.Type.HTTP).scheme("bearer").bearerFormat("JWT")));
    }

    /**
     * 누적 방문자수 조회
     */
    @Operation(summary = "누적 방문자수 조회", description = "누적 방문자수를 조회해서 보여준다. 날짜는 0000-00-00으로 정의했다. 1분마다 DB에 저장해주는 Schedule도 포함")
    @GetMapping("/total/visited")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "500", description = "서버 에러")
    })
    public ResponseEntity<?> totalVisitedCount() {
        String totalTempDate = "0000-00-00";
        // 방문한 사람이 있을 경우 or Redis에 값이 있을 경우
        if (redisUtils.isExists(totalTempDate)) {
            Long totalVisitedCount = redisUtils.get(totalTempDate, Long.class);
            return ResponseEntity.ok(TotalVisitedCount.builder()
                    .totalTempDate(totalTempDate)
                    .totalVisitedCount(totalVisitedCount).build());
        } else {
            VisitedMemberCount visitedMemberCount = visitedMemberCountRepository.findByNowDate(totalTempDate);
            return ResponseEntity.ok(TotalVisitedCount.builder()
                    .totalTempDate(totalTempDate)
                    .totalVisitedCount(visitedMemberCount.getVisitedCount()).build());
        }
    }

    /**
     * 일일 방문자수 조회
     */
    @Operation(summary = "일일 방문자수 조회", description = "일일 방문자수를 조회해서 보여준다. 1분마다 DB에 저장하는 스케쥴 기능 포함")
    @GetMapping("/daily/visited")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "500", description = "서버 에러")
    })
    public ResponseEntity<?> dailyVisitedCount() {
        String dateTimeDaily = visitedMemberCountService.DateTimeDaily();
        if (redisUtils.isExists(dateTimeDaily)) {
            long dailyCount = redisUtils.getBitCount(dateTimeDaily);
            return ResponseEntity.ok(DailyVisitedCount.builder()
                    .dailyVisitedCount(dailyCount)
                    .dailyDate(dateTimeDaily).build());
        } else {
            VisitedMemberCount visitedMemberCount = visitedMemberCountRepository.findByNowDate(dateTimeDaily);
            return ResponseEntity.ok(DailyVisitedCount.builder()
                    .dailyVisitedCount(visitedMemberCount.getVisitedCount())
                    .dailyDate(dateTimeDaily).build());
        }
    }


    /**
     * refreshToken이 있는지 확인
     */
    @Operation(summary = "refreshToken으로 로그인되었는지 확인")
    @GetMapping("/extension/login/check/refreshToken")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "500", description = "서버 에러")
    })
    public ResponseEntity<?> loginCheckByRefreshToken(HttpServletRequest request) {
        try {
            // 기존 쿠키 확인해서 refreshToken 검증진행
            Cookie[] myCookies = request.getCookies();
            String refreshToken;
            if (myCookies != null) {
                for (Cookie myCookie : myCookies) {
                    if (myCookie.getName().equals("refreshToken")) {
                        refreshToken = myCookie.getValue();
                        log.info("쿠키의 refreshToken = " + refreshToken);
                        log.info("refreshToken 유효성 검증 진행 시작");
                        jwtValidationService.validateRefreshToken(refreshToken);
                        log.info("refreshToken 유효성 검증 진행 완료");
                    }
                }
                log.info("쿠키에 refreshToken이 없습니다.");
                return ResponseEntity.ok("로그인한 유저입니다.");
            } else {
                return ResponseEntity.ok("쿠키에 refreshToken이 없습니다. 로그인 된 유저가 아닙니다요.");
            }

        } catch (TokenExpiredException e) {
            return new ResponseEntity<>("Refresh Token이 만료되었습니다", HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            return new ResponseEntity<>("Refresh Token이 유효하지 않습니다", HttpStatus.UNAUTHORIZED);
        }
    }


    /**
     * accessToken 유효성 검사 후 로그인되었는지 확인
     */
    @GetMapping(value = "/extension/login/check/accessToken", headers = "Authorization")
    @Operation(summary = "accessToken으로 유효성 검사 후 로그인 체크", description = "Authorization Bearer로 accessToken을 보내면 유효성 검사 후 ok이면 로그인됨, 아니면 로그인된 유저가 아니거나 잘못된 토큰 요청")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "500", description = "서버 에러")
    })
    public ResponseEntity<?> loginCheckByAccessToken() {
        Member member = securityUtil.getCurrentMember();
        if (member == null) {
            return ResponseEntity.ok("로그인되지 않은 유저이거나 유효하지 않은 토큰 요청입니다.");
        } else {
            MemberInformResponseDto memberInformResponseDto = MemberInformResponseDto.from(member);
            return ResponseEntity.ok(memberInformResponseDto + "로그인된 유저");
        }
    }


    @Operation(summary = "최근 조회한 프롬프트 조회", description = "최근 조회한 5개의 프롬프트를 반환한다")
    @GetMapping("/prompts/recent/{crntMemberUuid}")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "500", description = "서버 에러")
    })
    public ResponseEntity<?> findPromptsRecent(@PathVariable String crntMemberUuid) {
        List<PromptCardResponse> recentPrompts = promptClient.getRecentPrompts(crntMemberUuid);
        log.info("recentPrompts = " + recentPrompts);
        if (recentPrompts == null) {
            return ResponseEntity.ok("최근 조회한 프롬프트가 존재하지 않습니다.");
        } else {
            return ResponseEntity.ok(recentPrompts);
        }
    }

    /**
     * 멤버가 좋아요를 누름 프롬프트 조회
     */
    @GetMapping("/prompts/like/{crntMemberUuid}")
    @Operation(summary = "멤버의 좋아요 프롬프트 조회", description = "마이 프로필에서 좋아요한 프롬프트를 조회한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "500", description = "서버 에러")
    })
    public ResponseEntity<?> findPromptsLike(@PathVariable String crntMemberUuid,
                             @RequestParam("page") Integer page,
                             @RequestParam("size") Integer size) {
        try {

            PromptCardListResponse promptsLike = promptClient.getPromptsLike(crntMemberUuid, page, size);
            if (promptsLike == null) {
                return ResponseEntity.ok("좋아요를 누른 프롬프트가 존재하지 않습니다.");
            }
            return ResponseEntity.ok(promptsLike);
        } catch (Exception e) {
            return ResponseEntity.ok("좋아요를 누른 프롬프트가 존재하지 않습니다.");
        }
    }

    /**
     * 멤버가 북마크를 누른 프롬프트 조회
     */
    @GetMapping("/prompts/bookmark/{crntMemberUuid}")
    @Operation(summary = "멤버의 북마크 프롬프트 조회", description = "마이 프로필에서 북마크한 프롬프트를 조회한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "500", description = "서버 에러")
    })
    public ResponseEntity<?> findPromptsBookmark(@PathVariable String crntMemberUuid,
                                          @RequestParam("page") Integer page,
                                          @RequestParam("size") Integer size) {
        try {
            PromptCardListResponse promptsBookmark = promptClient.getPromptsBookmark(crntMemberUuid, page, size);
            if (promptsBookmark == null) {
                return ResponseEntity.ok("북마크를 누른 프롬프트가 존재하지 않습니다.");
            }
            return ResponseEntity.ok(promptsBookmark);
        } catch (Exception e) {
            return ResponseEntity.ok("북마크를 누른 프롬프트가 존재하지 않습니다.");
        }
    }

    /**
     * 멤버가 생성한 프롬프트 조회
     */
    @GetMapping("/prompts/profile/{crntMemberUuid}")
    @Operation(summary = "멤버가 생성한 프롬프트 조회", description = "마이 프로필에서 프롬프트 조회한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "500", description = "서버 에러")
    })
    public ResponseEntity<?> findPrompts(@PathVariable String crntMemberUuid,
                                          @RequestParam("page") Integer page,
                                          @RequestParam("size") Integer size) {
        try {
            PromptCardListResponse promptsBookmark = promptClient.getPrompts(crntMemberUuid, page, size);
            if (promptsBookmark == null) {
                return ResponseEntity.ok("생성한 프롬프트가 존재하지 않습니다.");
            }
            return ResponseEntity.ok(promptsBookmark);
        } catch (Exception e) {
            return ResponseEntity.ok("생성한 프롬프트가 존재하지 않습니다.");
        }
    }
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

        KakaoUserInfoResponseDto kakaoUserInfo;

        if (redirectUrl == null) {
            // 앱용
            kakaoUserInfo = kakaoLoginService.kakaoGetProfile(code);
        } else {
            // kakao Token 가져오기(권한)
            String kakaoAccessToken = kakaoLoginService.kakaoGetToken(code, redirectUrl);
            // Token으로 사용자 정보 가져오기
            kakaoUserInfo = kakaoLoginService.kakaoGetProfile(kakaoAccessToken);
        }

        // 기존 회원인지 검증
        String platformId = kakaoUserInfo.getId();
        Member member = memberService.memberCheck(Platform.KAKAO, platformId);
        // DB에 해당 유저가 없다면 회원가입 진행, 없으면 로그인 진행
        // 회원가입을 위해서 일단 프런트로 회원 정보를 넘기고 회원가입 페이지로 넘어가게 해야 할 듯
        if (member == null || member.getActivate().equals(false)) {
            // 회원가입 요청 메세지
            SocialSignUpDataResponseDto socialSignUpDataResponseDto = SocialSignUpDataResponseDto.fromKakao(kakaoUserInfo);
            return new ResponseEntity<>(SocialSignUpResponseDto.from(socialSignUpDataResponseDto), HttpStatus.OK);
        }
        // Jwt 토큰 생성
        JwtToken jwtToken = jwtProviderService.createJwtToken(member.getUserUuid());

        member.setRefreshToken(jwtToken.getRefreshToken());

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", jwtToken.getAccessToken());
        headers.add("Access-Control-Expose-Headers", "Authorization");


        // 기존 쿠키 제거
        Cookie myCookie = cookieUtils.findRefreshTokenCookie(request);
        if (myCookie != null) {
            myCookie.setMaxAge(0);
            response.addCookie(myCookie);
        }

        // 쿠키 설정
        ResponseCookie cookie = jwtProviderService.createSetCookie(jwtToken.getRefreshToken());

        response.setHeader("Access-Control-Allow-Origin", request.getHeader("Origin"));
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.addHeader("Set-Cookie", cookie.toString());


        // 로그인 시 최소한의 유저 정보 전달
        MemberInformResponseDto memberInformResponseDto = MemberInformResponseDto.from(member);

        ///////////////////////////////레디스/////////////////////////////////
        String dateTimeDaily = visitedMemberCountService.DateTimeDaily();
        // 방문한 사람이 있는지 확인
        if (redisUtils.isExists(dateTimeDaily)) {
            // 로그인한 유저가 오늘 방문했는지 확인
            if (!redisUtils.getBitSet(dateTimeDaily, member.getId())) {
                // 방문한 사람이 아니라면 방문 체크 및 전체 방문 수 1 증가
                redisUtils.setBitSet(dateTimeDaily, member.getId());
                redisUtils.setExpireTime(dateTimeDaily, 60 * 60 * 24);
                redisUtils.increaseTotalVisitedCount();
            }
        } else {
            // 첫 방문일 경우 일일 방문자수와 누적 방문자수 모두 생성
            redisUtils.setBitSet(dateTimeDaily, member.getId());
            redisUtils.setExpireTime(dateTimeDaily, 60 * 60 * 24);
            redisUtils.increaseTotalVisitedCount();
        }

        // 기존 redis 정보 삭제
//        redisService.deleteRedisData(member.getUserUuid().toString());

        // redis 설정(1. 유저 정보 저장 -> UUID나 AccessToken으로 회원 조회할 시 활용
        //           2. refreshToken 저장 -> accessToken 만료 시 DB가 아닌 Redis에서 먼저 찾아오기)
        redisService.saveRedisData(member.getUserUuid().toString(), memberInformResponseDto, jwtToken.getRefreshToken());
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
            SocialSignUpDataResponseDto socialSignUpDataResponseDto = SocialSignUpDataResponseDto.fromGoogle(googleProfile);

            SocialSignUpResponseDto socialSignUpResponseDto = SocialSignUpResponseDto.from(socialSignUpDataResponseDto);

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
        Cookie myCookie = cookieUtils.findRefreshTokenCookie(request);
        if (myCookie != null) {
            myCookie.setMaxAge(0);
            response.addCookie(myCookie);
        }


        ResponseCookie cookie = jwtProviderService.createSetCookie(jwtToken.getRefreshToken());

        response.setHeader("Access-Control-Allow-Origin", request.getHeader("Origin"));
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.addHeader("Set-Cookie", cookie.toString());

        // 로그인 시 최소한의 유저 정보 전달
        MemberInformResponseDto memberInformResponseDto = MemberInformResponseDto.from(member);

        ///////////////////////////////레디스/////////////////////////////////

        String dateTimeDaily = visitedMemberCountService.DateTimeDaily();
        // 방문한 사람이 있는지 확인
        if (redisUtils.isExists(dateTimeDaily)) {
            // 로그인한 유저가 오늘 방문했는지 확인
            if (!redisUtils.getBitSet(dateTimeDaily, member.getId())) {
                // 방문한 사람이 아니라면 방문 체크 및 전체 방문 수 1 증가
                redisUtils.setBitSet(dateTimeDaily, member.getId());
                redisUtils.setExpireTime(dateTimeDaily, 60 * 60 * 24);
                redisUtils.increaseTotalVisitedCount();
            }
        } else {
            // 첫 방문일 경우 일일 방문자수와 누적 방문자수 모두 생성
            redisUtils.setBitSet(dateTimeDaily, member.getId());
            redisUtils.setExpireTime(dateTimeDaily, 60 * 60 * 24);
            redisUtils.increaseTotalVisitedCount();
        }

        // 기존 redis 정보 삭제
//        redisService.deleteRedisData(member.getUserUuid().toString());

        // redis 설정(1. 유저 정보 저장 -> UUID나 AccessToken으로 회원 조회할 시 활용
        //           2. refreshToken 저장 -> accessToken 만료 시 DB가 아닌 Redis에서 먼저 찾아오기)
        redisService.saveRedisData(member.getUserUuid().toString(), memberInformResponseDto, jwtToken.getRefreshToken());
        ///////////////////////////////레디스/////////////////////////////////

        return ResponseEntity.ok()
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
        redisService.deleteRedisData(member.getUserUuid().toString());

        // Kakao 계정도 함께 로그아웃 진행
        if (member.getPlatform().equals(Platform.KAKAO)) {
            kakaoLoginService.KakaoLogout(redirectUrl);
        }

        // 기존 쿠키 제거
        Cookie myCookie = cookieUtils.findRefreshTokenCookie(request);
        if (myCookie != null) {
            myCookie.setMaxAge(0);
            response.addCookie(myCookie);
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
            Cookie myCookie = cookieUtils.findRefreshTokenCookie(request);
            if (myCookie != null) {
                myCookie.setMaxAge(0);
                response.addCookie(myCookie);
            }

            // 쿠키 설정
            ResponseCookie cookie = jwtProviderService.createSetCookie(jwtToken.getRefreshToken());

            response.setHeader("Access-Control-Allow-Origin", request.getHeader("Origin"));
            response.setHeader("Access-Control-Allow-Credentials", "true");
            response.addHeader("Set-Cookie", cookie.toString());

            Member member = jwtValidationService.findMemberByJWT(jwtToken.getAccessToken());
            MemberInformResponseDto memberInformResponseDto = MemberInformResponseDto.from(member);

            MemberSignUpResponseDto memberSignUpResponseDto = MemberSignUpResponseDto.builder()
                    .isSignUp(false)
                    .memberInformResponseDto(memberInformResponseDto).build();

            String dateTimeDaily = visitedMemberCountService.DateTimeDaily();
            // 방문한 사람이 있는지 확인
            if (redisUtils.isExists(dateTimeDaily)) {
                // 로그인한 유저가 오늘 방문했는지 확인
                if (!redisUtils.getBitSet(dateTimeDaily, member.getId())) {
                    // 방문한 사람이 아니라면 방문 체크 및 전체 방문 수 1 증가
                    redisUtils.setBitSet(dateTimeDaily, member.getId());
                    redisUtils.setExpireTime(dateTimeDaily, 60 * 60 * 24);
                    redisUtils.increaseTotalVisitedCount();
                }
            } else {
                // 첫 방문일 경우 일일 방문자수와 누적 방문자수 모두 생성
                redisUtils.setBitSet(dateTimeDaily, member.getId());
                redisUtils.setExpireTime(dateTimeDaily, 60 * 60 * 24);
                redisUtils.increaseTotalVisitedCount();
            }

            // Redis에 refreshToken과 유저 정보 저장
            redisService.saveRedisData(member.getUserUuid().toString(), memberInformResponseDto, jwtToken.getRefreshToken());

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(memberSignUpResponseDto);

        } catch (Exception e) {

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
        Cookie myCookie = cookieUtils.findRefreshTokenCookie(request);
        if (myCookie != null) {
            myCookie.setMaxAge(0);
            response.addCookie(myCookie);
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
    public ResponseEntity<?> refreshToken(HttpServletRequest request) {

        try {
            // 기존 쿠키 확인해서 refreshToken 검증진행
            Cookie[] myCookies = request.getCookies();
            String refreshToken = null;
            if (myCookies != null) {
                for (Cookie myCookie : myCookies) {
                    if (myCookie.getName().equals("refreshToken")) {
                        refreshToken = myCookie.getValue();
                        jwtValidationService.validateRefreshToken(refreshToken);
                    }
                }
            }

            // 기존 유저 찾아오기
            Member member = jwtValidationService.findMemberByJWT(refreshToken);
            String accessToken = jwtProviderService.createAccessToken(member.getUserUuid());

            HttpHeaders new_headers = new HttpHeaders();
            new_headers.add("Authorization", accessToken);

            return ResponseEntity.ok()
                    .headers(new_headers)
                    .body("accessToken이 새로 발급되었습니다.");

        } catch (TokenExpiredException e) {

            return new ResponseEntity<>("Refresh Token이 만료되었습니다", HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {

            return new ResponseEntity<>("Refresh Token이 유효하지 않습니다", HttpStatus.UNAUTHORIZED);
        }
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
    public ResponseEntity<MemberResponse> findMemberByUUID(@RequestParam UUID userUuid) throws Exception {

        if (redisUtils.isExists("member" + userUuid)) {
            log.info("redis로 회원 조회 중");
            MemberResponse memberResponse = redisUtils.get("member" + userUuid, MemberResponse.class);
            return new ResponseEntity<>(memberResponse, HttpStatus.OK);
        } else {
            log.info("DB로 회원 조회 중");
            log.info("userUuid = " + userUuid);
            Member member = memberRepository.findByUserUuid(userUuid);
            log.info("member = " + member);

            MemberResponse memberResponse = (null == member)
                ? new MemberResponse("알 수 없음", "", "")
                : MemberResponse.from(member);

            return new ResponseEntity<>(memberResponse, HttpStatus.OK);
        }
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
    public ResponseEntity<MemberInformResponseDto> findProfile() {
        return new ResponseEntity<>(securityUtil.getCurrentMemberInformResponseDto(), HttpStatus.OK);
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

        // 회원 정보 수정
        Member updateMember = memberService.updateProfile(nickname, file, member);

        return new ResponseEntity<>(MemberInformResponseDto.from(updateMember), HttpStatus.OK);
    }

    /**
     * 멤버가 생성한 톡 조회
     */
    @GetMapping("/talks/profile/{crntMemberUuid}")
    @Operation(summary = "멤버가 생성한 톡 조회", description = "프로필에서 톡을 조회한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "500", description = "서버 에러")
    })
    public ResponseEntity<MemberTalkList> findTalks(
            @PathVariable String crntMemberUuid,
            Pageable pageable
    ) {
        final MemberTalkList memberTalkList = promptClient.getTalks(crntMemberUuid, pageable);
        return ResponseEntity.ok(memberTalkList);
    }

}
