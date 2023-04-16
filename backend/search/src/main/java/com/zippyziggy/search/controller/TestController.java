package com.zippyziggy.search.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/search")
public class TestController {

	@GetMapping("/test")
	public ResponseEntity<String> test() {
		return ResponseEntity.ok("Search 테스트");
	}
}
