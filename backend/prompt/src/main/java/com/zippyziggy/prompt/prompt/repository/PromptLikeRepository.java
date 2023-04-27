package com.zippyziggy.prompt.prompt.repository;

import com.zippyziggy.prompt.prompt.model.Prompt;
import com.zippyziggy.prompt.prompt.model.PromptLike;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;


public interface PromptLikeRepository extends JpaRepository<PromptLike, Long>, PromptLikeCustomRepository {
    Long countAllByMemberUuidAndPrompt(UUID memberUuid, Prompt prompt);

    List<PromptLike> findAllByMemberUuid(UUID memberUuid);

    Optional<PromptLike> findByPromptAndMemberUuid(Prompt prompt, UUID memberUuid);


}
