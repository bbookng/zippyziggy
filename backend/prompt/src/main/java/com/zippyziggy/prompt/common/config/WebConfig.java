//package com.zippyziggy.prompt.common.config;
//
//import org.springframework.context.annotation.Configuration;
//import org.springframework.http.HttpMethod;
//import org.springframework.web.servlet.config.annotation.CorsRegistry;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//
//@Configuration
//public class WebConfig implements WebMvcConfigurer {
//
//    @Override
//    public void addCorsMappings(CorsRegistry registry) {
//        registry.addMapping("/**")
//                .allowCredentials(true)
//                .allowedOrigins("http://localhost:8080",
//                        "https://zippyziggy.kr",
//                        "http://zippyziggy.kr",
//                        "http://zippyziggy.kr:3000",
//                        "http://k8e205.p.ssafy.io:3000",
//                        "http://localhost:3000",
//                        "http://k8e205.p.ssafy.io:8000"
//                        )
//                .allowedHeaders("*")
//                .exposedHeaders(
//                        "Set-Cookie",
//                        "Authorization")
//                .allowedMethods(
//                        HttpMethod.GET.name(),
//                        HttpMethod.HEAD.name(),
//                        HttpMethod.PUT.name(),
//                        HttpMethod.DELETE.name(),
//                        HttpMethod.POST.name(),
//                        HttpMethod.OPTIONS.name());
//    }
//
//}
//
