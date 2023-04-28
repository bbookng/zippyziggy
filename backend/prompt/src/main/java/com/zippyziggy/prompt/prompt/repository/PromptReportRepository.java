package com.zippyziggy.prompt.prompt.repository;

import com.zippyziggy.prompt.prompt.model.PromptReport;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PromptReportRepository extends JpaRepository<PromptReport, Long> {
    Optional<PromptReport> findByMemberUuidAndPrompt_PromptUuid(UUID memberUuid, UUID promptUuid);

    Page<PromptReport> findAllByOrderByRegDtDesc(Pageable pageable);
}
