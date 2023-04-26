package com.zippyziggy.gateway.service;

import com.zippyziggy.gateway.model.Member;
import com.zippyziggy.gateway.repository.MemberRepository;
import org.apache.commons.codec.DecoderException;
import org.apache.commons.codec.binary.Hex;
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
        byte[] uuidBytes = new byte[0];
        try {
            uuidBytes = Hex.decodeHex(userUuid.replace("-", "").toCharArray());
        } catch (DecoderException e) {
            throw new RuntimeException(e);
        }
        UUID uuid = UUID.nameUUIDFromBytes(uuidBytes);
        Member member = memberRepository.findByUserUuid(uuid)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다."));
        if (member != null) {
            return new CustomUserDetail(member);
        }
        return null;

    }
}
