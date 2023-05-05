package com.zippyziggy.member.util;

import com.zippyziggy.member.dto.response.MemberInformResponseDto;
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

    @Autowired
    private RedisUtils redisUtils;

    // SecurityContext에 저장된 유저 정보 가져오기
    public Member getCurrentMember() {

        // 인증된 유저 가져오기
        CustomUserDetail principal = (CustomUserDetail) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String userUuid = principal.getUsername();
        UUID uuid = UUID.fromString(userUuid);

        return memberRepository.findByUserUuid(uuid).get();
    }

    // SecurityContext에 저장된 유저 정보 가져오기
    public MemberInformResponseDto getCurrentMemberInformResponseDto() {

        // 인증된 유저 가져오기
        CustomUserDetail principal = (CustomUserDetail) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        String userUuid = principal.getUsername();
        String MemberKey = "member" + userUuid;

        if (redisUtils.isExists(MemberKey)) {
            // Redis 캐쉬에 존재하는 경우
            MemberInformResponseDto dto = redisUtils.get(MemberKey, MemberInformResponseDto.class);
            return dto;

        } else {
            // Redis 캐쉬에 존재하지 않는 경우
            UUID uuid = UUID.fromString(userUuid);
            Member member = memberRepository.findByUserUuid(uuid).get();

            return MemberInformResponseDto.builder()
                    .nickname(member.getNickname())
                    .profileImg(member.getProfileImg())
                    .userUuid(member.getUserUuid()).build();
        }

    }

}
