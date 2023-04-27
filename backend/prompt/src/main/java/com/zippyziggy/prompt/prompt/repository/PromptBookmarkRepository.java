package com.zippyziggy.prompt.prompt.repository;

import com.zippyziggy.prompt.prompt.model.Prompt;
import com.zippyziggy.prompt.prompt.model.PromptBookmark;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PromptBookmarkRepository extends JpaRepository<PromptBookmark, Long> {
    Long countAllByMemberUuidAndPrompt(UUID crntMemberUuid, Prompt prompt);

	PromptBookmark findByMemberUuidAndPrompt(UUID crntMemberUuid, Prompt originPrompt);
}
