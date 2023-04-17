package com.zippyziggy.member.test;

import com.zippyziggy.member.model.Member;
import com.zippyziggy.member.model.Platform;
import com.zippyziggy.member.model.RoleType;
import com.zippyziggy.member.repository.MemberRepository;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;

import java.time.LocalDateTime;
import java.util.NoSuchElementException;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@AutoConfigureMockMvc
public class TestMethod {

    @Autowired
    private MemberRepository memberRepository;

    @Test
    @DisplayName("column default 설정 테스트")
    @Rollback(value = false)
    public void testColumnDefault() throws Exception {

        LocalDateTime regDt = LocalDateTime.now();

        Member member = Member.builder()
                .nickname("nickname")
                .profileImg("profileImg")
                .name("sangchan")
                .regDt(regDt)
                .activate(true)
                .role(RoleType.USER)
                .platform(Platform.KAKAO)
                .userUuid("1234")
                .build();

        memberRepository.save(member);

        Member findMember = memberRepository.findById(1L).orElseThrow(() -> new NoSuchElementException("no such data"));

        assertThat(findMember.getName()).isEqualTo(member.getName());

    }
}
