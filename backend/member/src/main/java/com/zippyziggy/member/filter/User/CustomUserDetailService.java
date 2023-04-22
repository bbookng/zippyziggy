package com.zippyziggy.member.filter.User;

import com.zippyziggy.member.model.Member;
import com.zippyziggy.member.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class CustomUserDetailService implements UserDetailsService {

    @Autowired
    private MemberRepository memberRepository;

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
