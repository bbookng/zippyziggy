package com.zippyziggy.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

//    @Bean
//    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
//        return builder.routes()
//                .route("swagger-ui", r -> r.path("/swagger-ui/index.html") // HTML에서 요청하는 URL 패턴
//                        .uri("lb://PROMPT/prompts-swagger")) // 백엔드에서 등록한 URL 패턴
//                .build();
//    }
}