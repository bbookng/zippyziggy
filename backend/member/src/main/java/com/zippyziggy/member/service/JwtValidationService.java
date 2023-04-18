package com.zippyziggy.member.service;

import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.zippyziggy.member.model.JwtResponse;
import com.zippyziggy.member.model.Member;
import com.zippyziggy.member.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Date;
import java.util.Optional;

import static com.auth0.jwt.JWT.require;

/**
 * JWT 검증과 관련된 서비스
 */
@Service
public class JwtValidationService {

    @Value("${jwt.secret.key}")
    private String jwtSecretKey; // jwt Secret key

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private JwtProviderService jwtProviderService;

    /**
     * access 토큰 유효성 검사
     * ACCESS_TOKEN_MISMATCH: 유효하지 않은 토큰입니다.
     * ACCESS_TOKEN_EXPIRED: 유효 시간이 만료된 토큰입니다.
     * ACCESS_TOKEN_SUCCESS: 정상 토큰
     */
    public JwtResponse validateAccessToken(String accessToken) throws Exception {

        try {
            boolean contentCheck = tokenContentCheck(accessToken);

            // token 내용이 유효한지 확인
            if (!contentCheck) {
                return JwtResponse.ACCESS_TOKEN_MISMATCH;
            }

            // JWT 분리시키기
            DecodedJWT verify = require(Algorithm.HMAC512(jwtSecretKey)).build().verify(accessToken);


            // 만료시간이 지난 경우 새로운 accessToken 생성
            if (verify.getExpiresAt().before(new Date())) {
//                UUID userUuid = UUID.fromString(verify.getClaim("userUuid").asString());
//                String nickname = verify.getClaim("nickname").asString();
//
//                String newAccessToken = jwtProviderService.createAccessToken(userUuid, nickname);

//                Base64.Decoder decoder = Base64.getUrlDecoder();
//                System.out.println("decoder = " + new String(decoder.decode(verify.getHeader())));

                return JwtResponse.ACCESS_TOKEN_EXPIRED;
            }
        } catch (TokenExpiredException e) {

            System.out.println("만료된 토큰입니다." + e);
            return JwtResponse.ACCESS_TOKEN_EXPIRED;

        } catch (Exception e) {

            System.out.println("유효하지 않은 토큰입니다" + e);
            return JwtResponse.ACCESS_TOKEN_MISMATCH;

        }

        return JwtResponse.ACCESS_TOKEN_SUCCESS;
    }

    /**
     * refresh 토큰 유효성 검사
     * MISMATCH: 유효하지 않은 토큰입니다. -> 재로그인
     * EXPIRED: 유효 시간이 만료된 토큰입니다. -> 1. accessToken이 유효한 경우 accessToken으로 refreshToken 생성
     *                                       2. accessToken이 만료된 경우 재로그인
     * SUCCESS: 정상 토큰
     */
    public JwtResponse validateRefreshToken(String refreshToken) {

        try {
            boolean contentCheck = tokenContentCheck(refreshToken);

            // token 내용이 유효한지 확인
            if (!contentCheck) {
                return JwtResponse.REFRESH_TOKEN_MISMATCH;
            }

            DecodedJWT verify = require(Algorithm.HMAC512(jwtSecretKey)).build().verify(refreshToken);


            // 만료시간이 지난 경우 새로운 accessToken 생성
            if (verify.getExpiresAt().before(new Date())) {
//                UUID userUuid = UUID.fromString(verify.getClaim("userUuid").asString());
//                String nickname = verify.getClaim("nickname").asString();
//
//                String newAccessToken = jwtProviderService.createAccessToken(userUuid, nickname);

//                Base64.Decoder decoder = Base64.getUrlDecoder();
//                System.out.println("decoder = " + new String(decoder.decode(verify.getHeader())));

                return JwtResponse.REFRESH_TOKEN_EXPIRED;
            }
        } catch (TokenExpiredException e) {

            System.out.println("만료된 토큰입니다." + e);
            return JwtResponse.REFRESH_TOKEN_EXPIRED;

        } catch (Exception e) {

            System.out.println("유효하지 않은 토큰입니다" + e);
            return JwtResponse.REFRESH_TOKEN_MISMATCH;

        }
        return JwtResponse.REFRESH_TOKEN_SUCCESS;
    }

    /**
     * 토큰 내용으로 JWT 유효성 검사
     * @param token
     * @return 토큰 내용이 검증되면 true, 아닐 시 false
     * @throws NoSuchAlgorithmException 알고리즘 없는 경우
     * @throws InvalidKeyException key가 사용할 수 없는 경우
     */
    public boolean tokenContentCheck(String token) throws NoSuchAlgorithmException, InvalidKeyException {

        DecodedJWT verify = require(Algorithm.HMAC512(jwtSecretKey)).build().verify(token);

        // token이 가지고 있는 signature 추출
        String signature = verify.getSignature();

        // header와 payload를 합치기(JWT signature 생성 규칙)
        String data = verify.getHeader() + "." +verify.getPayload();

        // header와 payload를 통해 암호화 진행 -> bytes를 Base64url로 반환
        String result = hmacWithJava("HmacSHA512", data, jwtSecretKey);

        // token이 유효한지 확인
        return signature.equals(result);
    }

    // Hmac과 SHA512 암호화를 위한 로직
    private String hmacWithJava(String algorithm, String data, String key)
            throws NoSuchAlgorithmException, InvalidKeyException {
        SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes(), algorithm);
        Mac mac = Mac.getInstance(algorithm);
        mac.init(secretKeySpec);
        String temp = Base64.getEncoder().encodeToString(mac.doFinal(data.getBytes()));
        temp = temp.replace("+", "-");
        temp = temp.replace("/", "_");
        temp = temp.replace("=", "");

        return temp;
    }


    /**
     * JWT Token으로 닉네임 파싱 후 유저 정보 가져오기
     */
    public Member findMemberByJWT(String token) {
        DecodedJWT verify = require(Algorithm.HMAC512(jwtSecretKey)).build().verify(token);

        String nickname = verify.getClaim("nickname").asString();

        Optional<Member> member = memberRepository.findByNicknameEquals(nickname);

        return member.get();
    }

}
