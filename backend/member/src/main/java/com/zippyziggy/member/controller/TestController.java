package com.zippyziggy.member.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/members")
public class TestController {

	@GetMapping("/test")
	public ResponseEntity<String> test() {
		return ResponseEntity.ok("Complete");
	}
}
