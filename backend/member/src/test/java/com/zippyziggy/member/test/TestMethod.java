package com.zippyziggy.member.test;

import com.zippyziggy.member.config.CustomModelMapper;
import com.zippyziggy.member.dto.response.MemberInformResponseDto;
import com.zippyziggy.member.model.Member;
import com.zippyziggy.member.model.Platform;
import com.zippyziggy.member.model.RoleType;
import com.zippyziggy.member.repository.MemberRepository;
import com.zippyziggy.member.service.JwtProviderService;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.test.annotation.Rollback;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.NoSuchElementException;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@AutoConfigureMockMvc
public class TestMethod {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private JwtProviderService jwtProviderService;

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    @Autowired
    private CustomModelMapper customModelMapper;

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
                .userUuid(null)
                .build();

        memberRepository.save(member);

        Member findMember = memberRepository.findById(1L).orElseThrow(() -> new NoSuchElementException("no such data"));

        assertThat(findMember.getName()).isEqualTo(member.getName());

    }

    @Test
    @DisplayName("redis template 사용")
    void tokenSaveRedisTemplate() {
        //given
        UUID uuid = UUID.randomUUID();
        String refreshToken = jwtProviderService.createRefreshToken(uuid);

        //when
        String key = "refreshToken" + uuid;
        ValueOperations<String, String> valueOperations = redisTemplate.opsForValue();
        valueOperations.set(key, refreshToken, Duration.ofSeconds(10));


        //then
        Object o = redisTemplate.opsForValue().get(key);
        System.out.println("o = " + o);


    }

    @Test
    @DisplayName("modelMapper test")
    public void testModelMapper() {
        //given
        Member member = Member.builder().profileImg("profileImg").nickname("nickname").build();
        ModelMapper modelMapper = customModelMapper.strictMapper();

        //when
        MemberInformResponseDto dto = modelMapper.map(member, MemberInformResponseDto.class);

        //then
        assertThat(member.getNickname()).isEqualTo(dto.getNickname());
        assertThat(member.getProfileImg()).isEqualTo(dto.getProfileImg());
        System.out.println("dto = " + dto);

    }


}
