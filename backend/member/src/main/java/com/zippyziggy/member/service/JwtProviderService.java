package com.zippyziggy.member.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.zippyziggy.member.filter.User.CustomUserDetailService;
import com.zippyziggy.member.model.JwtResponse;
import com.zippyziggy.member.model.JwtToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.net.http.HttpRequest;
import java.util.Date;
import java.util.UUID;

import static com.auth0.jwt.JWT.require;

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

    @Autowired
    private CustomUserDetailService customUserDetailService;

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

    /**
     * 헤더로부터 token 받아오기. "Authorization" : "Token값"
     */
    public String resolveToken(HttpServletRequest request) {
        String authorization = request.getHeader("Authorization");
        if (authorization != null) {
            authorization = authorization.replace("Bearer ", "");
        }
        return authorization;
    }

    /**
     * JWT 토큰에서 인증 정보 조회
     */
    public Authentication getAuthentication(String token) {
            DecodedJWT verify = require(Algorithm.HMAC512(jwtSecretKey)).build().verify(token);
            String nickname = verify.getClaim("nickname").asString();
            UserDetails userDetails = customUserDetailService.loadUserByUsername(nickname);
            return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
    }

}
