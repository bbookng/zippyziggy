package com.zippyziggy.prompt.prompt.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.zippyziggy.prompt.prompt.model.PromptComment;

public interface PromptCommentRepository extends JpaRepository<PromptComment, Long> {
	Page<PromptComment> findAllByPromptUuid(String promptUuid, Pageable pageable);
}
