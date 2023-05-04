package com.zippyziggy.member.repository;

import com.zippyziggy.member.model.VisitedMemberCount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VisitedMemberCountRepository extends JpaRepository<VisitedMemberCount, Long> {
    // 날짜로 해당 객체 불러오기
    VisitedMemberCount findByNowDate(String nowDate);

}
