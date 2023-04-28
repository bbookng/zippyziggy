package com.zippyziggy.prompt.talk.repository;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.zippyziggy.prompt.talk.model.Talk;

public interface TalkRepository extends JpaRepository<Talk, Long> {
	Page<Talk> findAllByPromptPromptUuid(UUID promptUuid, Pageable pageable);

	long countAllByPromptPromptUuid(UUID promptUuid);
}
