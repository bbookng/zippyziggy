package com.zippyziggy.prompt.prompt.repository;

import com.zippyziggy.prompt.prompt.model.Prompt;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface PromptBookmarkCustomRepository {

    public List<Prompt> findAllPromptsByMemberUuid(UUID memberUuid, Pageable pageable);
}
