package com.zippyziggy.prompt.prompt.repository;

import com.zippyziggy.prompt.prompt.model.Prompt;
import com.zippyziggy.prompt.prompt.model.PromptLike;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;


public interface PromptLikeRepository extends JpaRepository<PromptLike, Long> {
    Long countAllByMemberUuidAndPrompt(UUID memberUuid, Prompt prompt);

}
