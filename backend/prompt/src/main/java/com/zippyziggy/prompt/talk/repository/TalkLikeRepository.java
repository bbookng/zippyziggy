package com.zippyziggy.prompt.talk.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zippyziggy.prompt.talk.model.TalkLike;

public interface TalkLikeRepository extends JpaRepository<TalkLike, Long> {
	TalkLike findByIdAndMemberUuid(Long talkId, UUID crntMemberUuid);

	Long countAllByTalkId(Long talkId);
}
