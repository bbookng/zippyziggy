package com.zippyziggy.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;

import java.util.Arrays;

@Configuration
@EnableWebFluxSecurity
public class WebConfig {

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        return http.cors()
                .configurationSource(request -> {
                    CorsConfiguration cors = new CorsConfiguration();
                    cors.setAllowedOrigins(Arrays.asList("http://k8e205.p.ssafy.io:8000", "http://localhost:3000", "http://localhost:8080"));
                    cors.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    cors.setAllowedHeaders(Arrays.asList("*"));
                    cors.setExposedHeaders(Arrays.asList("Authorization", "Set-Cookie"));
                    return cors.applyPermitDefaultValues();
                })
                .and()
                .csrf().disable()
                .formLogin().disable()
                .httpBasic().disable()
                .authorizeExchange(exchange -> exchange
                        .pathMatchers(HttpMethod.OPTIONS).permitAll()
                        .anyExchange().permitAll())

                .build();
    }

}
