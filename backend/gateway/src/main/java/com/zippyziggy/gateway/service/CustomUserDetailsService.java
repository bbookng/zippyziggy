package com.zippyziggy.gateway.service;

import com.zippyziggy.gateway.model.Member;
import com.zippyziggy.gateway.repository.MemberRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.nio.ByteBuffer;
import java.util.UUID;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final MemberRepository memberRepository;

    CustomUserDetailsService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String userUuid) throws UsernameNotFoundException {
        UUID uuid = UUID.fromString(userUuid);
        byte[] uuidBytes = ByteBuffer.allocate(16)
                .putLong(uuid.getMostSignificantBits())
                .putLong(uuid.getLeastSignificantBits())
                .array();
        Member member = memberRepository.findByUserUuid(uuidBytes)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다."));
        if (member != null) {
            return new CustomUserDetail(member);
        }
        return null;

    }
}
