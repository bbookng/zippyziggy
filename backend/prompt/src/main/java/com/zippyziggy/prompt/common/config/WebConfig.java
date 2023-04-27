package com.zippyziggy.prompt.common.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:8080")
                .allowedOrigins("https://zippyziggy.kr")
                .allowedOrigins("http://zippyziggy.kr")
                .allowedOrigins("http://zippyziggy.kr:3000")
                .allowedOrigins("http://k8e205.p.ssafy.io:3000")
                .allowedOrigins("http://localhost:3000")
                .allowCredentials(true)
                .allowedHeaders("*")
                .exposedHeaders("Set-Cookie")
                .exposedHeaders("Authorization")
                .allowedMethods(HttpMethod.GET.name())
                .allowedMethods(HttpMethod.HEAD.name())
                .allowedMethods(HttpMethod.PUT.name())
                .allowedMethods(HttpMethod.DELETE.name())
                .allowedMethods(HttpMethod.OPTIONS.name());
    }

}

