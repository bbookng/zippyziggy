package com.zippyziggy.member.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;

/**
 * swagger 접속을 위한 url
 * http://localhost:포트번호/swagger-ui/index.html
 */

@Configuration
public class SwaggerConfig {

    @Bean
    public Docket api() {
        return new Docket(DocumentationType.OAS_30)
                .useDefaultResponseMessages(false) // Swagger에서 기본 제공해주는 method false
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.zippyziggy.member.controller")) // 경로 설정
                .paths(PathSelectors.ant("/members/**")) // /api로 시작하는 controller 대상
                .build()
                .apiInfo(apiInfo());
    }

    // Swagger의 화면 구성에 대한 정보
    private ApiInfo apiInfo() {
        return new ApiInfoBuilder()
                .title("Zippy Ziggy Swagger")
                .description("Member Api Swagger Info")
                .version("1.0")
                .build();
    }
}
