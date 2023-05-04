package com.zippyziggy.prompt.prompt.repository;

import com.zippyziggy.prompt.prompt.model.PromptClick;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PromptClickRepository extends JpaRepository<PromptClick, Long> {
    List<PromptClick> findTop5DistinctByMemberUuidAndPrompt_StatusCode_OpenOrderByRegDtDesc(UUID memberUuid);

}
