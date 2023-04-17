package com.zippyziggy.member.repository;

import com.zippyziggy.member.model.Member;
import com.zippyziggy.member.model.Platform;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {

    // platformId와 platform으로 기존 유저인지 확인하기
    Optional<Member> findByPlatformAndPlatformId(Platform platform, Long platformId);
}
