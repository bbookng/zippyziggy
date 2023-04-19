package com.zippyziggy.member.filter;

import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.zippyziggy.member.model.JwtResponse;
import com.zippyziggy.member.model.Member;
import com.zippyziggy.member.service.JwtProviderService;
import com.zippyziggy.member.service.JwtValidationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

@RequiredArgsConstructor
public class JwtAuthenticationFilter extends GenericFilter {

    private final JwtValidationService jwtValidationService;
    private final JwtProviderService jwtProviderService;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        // 헤더에서 JWT를 받아온다.
        String token = jwtProviderService.resolveToken((HttpServletRequest) request);
        System.out.println("여기로 들어왔나? token = " + token);

        if (token != null) {
            System.out.println("1111111");
            try {
                System.out.println("2222222");

                // accessToken인지 refreshToken인지 확인
                String tokenType = jwtValidationService.checkToken(token);
                System.out.println("333333");
                System.out.println("tokenasdfasdfㅁ나ㅣㅇ러ㅣㅁ넝라ㅣㅓType = " + tokenType);
                // accessToken인 경우
                if (tokenType.equals("accessToken")) {

                    //유효한 access토큰인지 확인
                    JwtResponse jwtResponse = jwtValidationService.validateAccessToken(token);
                    System.out.println("jwtResponse = " + jwtResponse);

                }
                // refreshToken인 경우
                else {

                    //유효한 refresh토큰인지 확인
                    JwtResponse jwtResponse = jwtValidationService.validateRefreshToken(token);
                    System.out.println("jwtResponse = " + jwtResponse);

                }

                // 토큰이 유효하면 토큰으로부터 유저 정보를 받아온다.
                Authentication authentication = jwtProviderService.getAuthentication(token);

                // SecurityContext 에 Authentication 객체를 저장합니다.
                SecurityContextHolder.getContext().setAuthentication(authentication);

            } catch (JWTDecodeException e) {

                System.out.println(e.getMessage());
                System.out.println("e = " + e);
                String tokenType = jwtValidationService.checkToken(token);
                request.setAttribute("tokenType", tokenType);
                if (tokenType.equals("accessToken")) {
                    request.setAttribute("exception", JwtResponse.ACCESS_TOKEN_MISMATCH.getJwtResponse());
                } else {
                    request.setAttribute("exception", JwtResponse.REFRESH_TOKEN_MISMATCH.getJwtResponse());
                }

            } catch (TokenExpiredException e) {

                System.out.println(e.getMessage());
                System.out.println("e = " + e);

                String tokenType = jwtValidationService.checkToken(token);
                request.setAttribute("tokenType", tokenType);

                if (tokenType.equals("accessToken")) {
                    request.setAttribute("exception", JwtResponse.ACCESS_TOKEN_EXPIRED.getJwtResponse());
                } else {
                    request.setAttribute("exception", JwtResponse.REFRESH_TOKEN_EXPIRED.getJwtResponse());
                }

            } catch (Exception e) {

                String tokenType = jwtValidationService.checkToken(token);
                request.setAttribute("tokenType", tokenType);
                if (tokenType.equals("accessToken")) {
                    request.setAttribute("exception", JwtResponse.ACCESS_TOKEN_MISMATCH.getJwtResponse());
                } else {
                    request.setAttribute("exception", JwtResponse.REFRESH_TOKEN_MISMATCH.getJwtResponse());
                }
            }


        }
        chain.doFilter(request, response);
    }
}
