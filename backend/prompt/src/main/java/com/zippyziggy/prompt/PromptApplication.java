package com.zippyziggy.prompt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@SpringBootApplication
@EnableEurekaClient
public class PromptApplication {

	public static void main(String[] args) {
		SpringApplication.run(PromptApplication.class, args);
	}

}
