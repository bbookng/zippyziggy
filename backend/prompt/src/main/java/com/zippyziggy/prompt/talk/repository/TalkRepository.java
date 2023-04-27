package com.zippyziggy.prompt.talk.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zippyziggy.prompt.talk.model.Talk;

public interface TalkRepository extends JpaRepository<Talk, Long> {
	List<Talk> findAllByPromptPromptUuid(UUID promptUuid);

	List<Talk> findAllByPromptUuid(UUID promptUuid);
}
