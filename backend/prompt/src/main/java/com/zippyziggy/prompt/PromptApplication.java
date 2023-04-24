package com.zippyziggy.prompt;

import static org.springframework.web.servlet.function.RequestPredicates.*;
import static org.springframework.web.servlet.function.RouterFunctions.*;

import java.net.URI;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerResponse;

@SpringBootApplication
@EnableEurekaClient
@EnableFeignClients
public class PromptApplication {

	public static void main(String[] args) {
		SpringApplication.run(PromptApplication.class, args);
	}

	@Bean
	RouterFunction<ServerResponse> routerFunction() {
		return route(GET("/prompts/swagger"), req ->
			ServerResponse.temporaryRedirect(URI.create("swagger-ui/index.html")).build());
	}


}
