package com.zippyziggy.member.util;

import com.zippyziggy.member.filter.User.CustomUserDetail;
import com.zippyziggy.member.model.Member;
import com.zippyziggy.member.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class SecurityUtil {

    private SecurityUtil() {
    }

    @Autowired
    private MemberRepository memberRepository;

    // SecurityContext에 저장된 유저 정보 가져오기
    public Member getCurrentMember() {

        // 인증된 유저 가져오기
        CustomUserDetail principal = (CustomUserDetail) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String userUuid = principal.getUsername();
        UUID uuid = UUID.fromString(userUuid);

        return memberRepository.findByUserUuid(uuid).get();
    }

}
