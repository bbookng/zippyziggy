package com.zippyziggy.prompt.prompt.repository;

import com.zippyziggy.prompt.prompt.model.Prompt;
import com.zippyziggy.prompt.prompt.model.PromptLike;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;


public interface PromptLikeRepository extends JpaRepository<PromptLike, Long>, PromptLikeCustomRepository {
    Long countAllByMemberUuidAndPrompt(UUID memberUuid, Prompt prompt);

    // 해당 멤버가 좋아요를 누른 promptId 받아오기
    List<PromptLike> findAllByMemberUuidOrderByRegDtDesc(UUID memberUuid, Pageable pageable);

    // 좋아요 상태 조회하기
    Optional<PromptLike> findByPromptAndMemberUuid(Prompt prompt, UUID memberUuid);

}
