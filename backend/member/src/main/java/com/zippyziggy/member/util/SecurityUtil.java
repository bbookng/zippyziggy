package com.zippyziggy.member.util;

import com.zippyziggy.member.config.CustomModelMapper;
import com.zippyziggy.member.model.Member;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class SecurityUtil {

    private SecurityUtil() {
    }

    // SecurityContext에 저장된 유저 정보 가져오기
    public UUID getCurrentUserUuid() {

        // 인증된 유저 가져오기
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 객체를 Model entity 형식에 맞게 변환
        CustomModelMapper customModelMapper = new CustomModelMapper();
        ModelMapper modelMapper = customModelMapper.strictMapper();
        Member member = modelMapper.map(principal, Member.class);

        return member.getUserUuid();
    }

}
