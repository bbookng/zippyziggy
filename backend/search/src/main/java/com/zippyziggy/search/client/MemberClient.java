package com.zippyziggy.search.client;

import com.zippyziggy.search.dto.response.server.Member;
import java.util.Optional;
import java.util.UUID;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "member")
public interface MemberClient {
    @GetMapping("/members/uuid")
    Optional<Member> getMemberInfo(@RequestParam UUID userUuid);
}