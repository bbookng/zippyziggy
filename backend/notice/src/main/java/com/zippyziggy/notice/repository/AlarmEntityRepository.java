package com.zippyziggy.notice.repository;

import com.zippyziggy.notice.entity.AlarmEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

@Transactional
public interface AlarmEntityRepository extends JpaRepository<AlarmEntity, Long> {
}
