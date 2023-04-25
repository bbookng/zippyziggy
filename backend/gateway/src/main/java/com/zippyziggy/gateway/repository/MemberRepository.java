package com.zippyziggy.gateway.repository;

import com.zippyziggy.gateway.model.Platform;
import org.springframework.data.jpa.repository.JpaRepository;
import com.zippyziggy.gateway.model.Member;

import java.util.Optional;
import java.util.UUID;

public interface MemberRepository extends JpaRepository<Member, Long> {

    Optional<Member> findByPlatformAndPlatformId(Platform platform, String platformId);

    // UUID와 일차하는 유저 찾기
    Optional<Member> findByUserUuidEquals(UUID userUuid);
}

