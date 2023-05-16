package com.zippyziggy.prompt.prompt.client;

import com.zippyziggy.prompt.prompt.dto.response.MemberResponse;

import java.util.List;
import java.util.UUID;

import com.zippyziggy.prompt.recommender.dto.response.MemberIdResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name="member")
public interface MemberClient {
    @GetMapping("/members/uuid")
    MemberResponse getMemberInfo(@RequestParam UUID userUuid);

    @GetMapping("/members/ids")
    List<MemberIdResponse> getAllMemberIds();

    @GetMapping("/members/long")
    Long getLongId(String memberUuid);
}