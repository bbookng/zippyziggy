package com.zippyziggy.prompt.prompt.repository;

import com.zippyziggy.prompt.prompt.model.Prompt;
import com.zippyziggy.prompt.prompt.model.PromptLike;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;


public interface PromptLikeRepository extends JpaRepository<PromptLike, Long>, PromptLikeCustomRepository {
    Long countAllByMemberUuidAndPrompt(UUID memberUuid, Prompt prompt);

    // 해당 멤버가 좋아요를 누른 promptId 받아오기
    List<PromptLike> findAllByMemberUuidOrderByRegDtDesc(UUID memberUuid, Pageable pageable);

    // 좋아요 상태 조회하기
    PromptLike findByPromptAndMemberUuid(Prompt prompt, UUID memberUuid);

    List<PromptLike> findAllByMemberUuid(UUID memberUuid);

    boolean existsByMemberUuidAndPrompt_PromptUuid(
        UUID memberUuid, UUID promptUuid);


}
