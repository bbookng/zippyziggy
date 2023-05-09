package com.zippyziggy.prompt.prompt.client;

import com.zippyziggy.prompt.prompt.dto.response.MemberResponse;
import java.util.UUID;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name="member")
public interface MemberClient {
    @GetMapping("/members/uuid")
    MemberResponse getMemberInfo(@RequestParam UUID userUuid);
}