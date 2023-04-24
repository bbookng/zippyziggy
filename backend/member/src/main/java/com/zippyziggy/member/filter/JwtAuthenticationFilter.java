package com.zippyziggy.member.filter;

import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.zippyziggy.member.model.JwtResponse;
import com.zippyziggy.member.service.JwtProviderService;
import com.zippyziggy.member.service.JwtValidationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

import static com.auth0.jwt.JWT.require;

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
            // accessToken인지 refreshToken인지 확인
            String tokenType = jwtValidationService.checkToken(token);

            if (tokenType.equals("accessToken")) {
                //유효한 access토큰인지 확인
                JwtResponse jwtResponse = jwtValidationService.validateAccessToken(token);
                System.out.println("jwtResponse = " + jwtResponse);
            } else {
                //유효한 refresh토큰인지 확인
                JwtResponse jwtResponse = jwtValidationService.validateRefreshToken(token);
                System.out.println("jwtResponse = " + jwtResponse);
            }

            // 토큰이 유효하면 토큰으로부터 유저 정보를 받아온다.
            Authentication authentication = null;
            try {
                authentication = jwtProviderService.getAuthentication(token);
            } catch (Exception e) {
                System.out.println(e.getMessage());
            }
            // SecurityContext 에 Authentication 객체를 저장합니다.
            SecurityContextHolder.getContext().setAuthentication(authentication);

        }
        chain.doFilter(request, response);
    }
}
