package com.zippyziggy.notice.repository;

import com.zippyziggy.notice.entity.AlarmEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
public interface AlarmEntityRepository extends JpaRepository<AlarmEntity, Long> {

    // 유저관련 알람 모두 삭제
    void deleteAllByMemberUuid(String memberUuid);

    // 유저관련 알람 모두 가져오기
    List<AlarmEntity> findAllByMemberUuidOrderByIdDesc(String memberUuid, Pageable pageable);

    // 유저의 읽지 않은 알람 개수 가져오기
    long countByMemberUuidAndIsReadFalse(String memberUuid);

    // 유저의 읽지 않은 알람 모두 가져오기
    List<AlarmEntity> findAllByMemberUuidAndIsReadFalse(String memberUuid);

}
