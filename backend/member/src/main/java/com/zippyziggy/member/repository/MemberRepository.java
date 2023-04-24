package com.zippyziggy.member.repository;

import com.zippyziggy.member.model.Member;
import com.zippyziggy.member.model.Platform;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface MemberRepository extends JpaRepository<Member, Long> {

    // platformId와 platform으로 기존 유저인지 확인하기
    Optional<Member> findByPlatformAndPlatformId(Platform platform, String platformId);

    // nickname과 일치하는 유저 찾기
    Optional<Member> findByNicknameEquals(String nickname);

    // UUID와 일차하는 유저 찾기
    Optional<Member> findByUserUuidEquals(UUID userUuid);
}
