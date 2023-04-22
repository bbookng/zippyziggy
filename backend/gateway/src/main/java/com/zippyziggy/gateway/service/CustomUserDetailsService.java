package com.zippyziggy.gateway.service;

import com.zippyziggy.gateway.model.Member;
import com.zippyziggy.gateway.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final MemberRepository memberRepository;

    CustomUserDetailsService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String userUuid) throws UsernameNotFoundException {
        Member member = memberRepository.findByUserUuidEquals(UUID.fromString(userUuid))
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다."));
        if (member != null) {
            return new CustomUserDetail(member);
        }
        return null;

    }
}
