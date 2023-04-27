package com.zippyziggy.prompt.prompt.client;

import com.zippyziggy.prompt.prompt.dto.response.MemberResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Optional;
import java.util.UUID;

@FeignClient(name="member")
public interface MemberClient {
    @GetMapping("/members/uuid")
    Optional<MemberResponse> getMemberInfo(@RequestParam String userUuid);
}