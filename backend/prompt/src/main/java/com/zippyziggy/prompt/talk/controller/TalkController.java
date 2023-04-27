package com.zippyziggy.prompt.talk.controller;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zippyziggy.prompt.talk.dto.response.TalkListResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.security.SecurityScheme;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/talks")
@RequiredArgsConstructor
@Tag(name = "톡 API")
public class TalkController {

	@Bean
	public OpenAPI customOpenAPI() {
		return new OpenAPI().components(new Components().addSecuritySchemes("bearer-key",
			new SecurityScheme().type(SecurityScheme.Type.HTTP).scheme("bearer").bearerFormat("JWT")));
	}

	@Operation(summary = "톡 목록 조회", description = "톡 목록을 전체 조회한다.")
	@GetMapping("")
	public ResponseEntity<?> getTalkList() {
		return null;
	}

	@Operation(summary = "톡 생성", description = "새로운 톡을 생성한다.")
	@PostMapping("")
	public ResponseEntity<?> createTalk() {
		return null;
	}

}
