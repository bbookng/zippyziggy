package com.zippyziggy.prompt.prompt.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.zippyziggy.prompt.prompt.model.PromptComment;

public interface PromptCommentRepository extends JpaRepository<PromptComment, Long> {
	Page<PromptComment> findAllByPromptPromptUuid(UUID promptUuid, Pageable pageable);

	List<PromptComment> findAllByPromptPromptUuid(UUID promptUuid);

	Long countAllByPromptPromptUuid(UUID promptUuid);

	List<PromptComment> findAllByMemberUuid(UUID memberUuid);
}
