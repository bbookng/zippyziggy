package com.zippyziggy.member.util;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

@Component
@RequiredArgsConstructor
public class CookieUtils {

    public Cookie findRefreshTokenCookie (HttpServletRequest request) {
        // 기존 쿠키 제거
        Cookie[] myCookies = request.getCookies();
        if (myCookies != null) {
            for (Cookie myCookie : myCookies) {
                if (myCookie.getName().equals("refreshToken")) {
                    return myCookie;
                }
            }
        }
        return null;
    }

}
