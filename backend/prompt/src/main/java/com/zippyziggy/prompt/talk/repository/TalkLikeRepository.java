package com.zippyziggy.prompt.talk.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zippyziggy.prompt.talk.model.TalkLike;

public interface TalkLikeRepository extends JpaRepository<TalkLike, Long> {
	TalkLike findByPromptUuidAndMemberUuid(UUID promptUuid, UUID crntMemberUuid);

	Long CountAllByTalkId(Long talkId);
}
