package com.zippyziggy.member.client;


import org.springframework.cloud.openfeign.FeignClient;

@FeignClient(name="prompt")
public interface PromptClient {
}