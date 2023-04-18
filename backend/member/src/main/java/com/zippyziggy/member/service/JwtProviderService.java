package com.zippyziggy.member.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.zippyziggy.member.model.JwtToken;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.UUID;

/**
 * JWT 토큰 생성과 관련된 서비스
 */
@Service
public class JwtProviderService {

    @Value("${jwt.secret.key}")
    private String jwtSecretKey; // jwt Secret key

    @Value("${jwt.access.token.expiration.time}")
    private int accessTokenExpirationTime; // 60초 * 30 -> 30분

    @Value("${jwt.refresh.token.expiration.time}")
    private int refreshTokenExpierationTime; // 60초 * 60 * 24 * 14 -> 2주


    /**
     * accessToken, refreshToken 생성
     * user의 UUID와 nickname
     */
    public JwtToken createJwtToken(UUID userUuid, String nickname) {

        //Access Token 생성
        String accessToken = JWT.create()
                .withSubject("accessToken")
                .withExpiresAt(new Date(System.currentTimeMillis() + + accessTokenExpirationTime))
                .withClaim("userUuid", userUuid.toString())
                .withClaim("nickname", nickname)
                .sign(Algorithm.HMAC512(jwtSecretKey));

        //Refresh token 생성
        String refreshToken = JWT.create()
                .withSubject("refreshToken")
                .withExpiresAt(new Date(System.currentTimeMillis() + refreshTokenExpierationTime))
                .withClaim("userUuid", userUuid.toString())
                .withClaim("nickname", nickname)
                .sign(Algorithm.HMAC512(jwtSecretKey));

        return JwtToken.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();

    }

    /**
     * accessToken 생성
     */
    public String createAccessToken(UUID userUuid, String nickname) {

        //Access Token 생성
        String accessToken = JWT.create()
                .withSubject("accessToken")
                .withExpiresAt(new Date(System.currentTimeMillis() + + accessTokenExpirationTime))
                .withClaim("userUuid", userUuid.toString())
                .withClaim("nickname", nickname)
                .sign(Algorithm.HMAC512(jwtSecretKey));

        return accessToken;

    }

    /**
     * refreshToken 생성
     */
    public String createRefreshToken(UUID userUuid, String nickname) {

        //Refresh token 생성
        String refreshToken = JWT.create()
                .withSubject("refreshToken")
                .withExpiresAt(new Date(System.currentTimeMillis() + refreshTokenExpierationTime))
                .withClaim("userUuid", userUuid.toString())
                .withClaim("nickname", nickname)
                .sign(Algorithm.HMAC512(jwtSecretKey));

        return refreshToken;
    }
}
