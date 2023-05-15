package com.zippyziggy.prompt.prompt.repository;


import com.zippyziggy.prompt.prompt.model.Prompt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface PromptLikeCustomRepository {

    // 좋아요한 프롬프트 조회
    public Page<Prompt> findAllPromptsByMemberUuid(UUID memberUuid, Pageable pageable);

}
