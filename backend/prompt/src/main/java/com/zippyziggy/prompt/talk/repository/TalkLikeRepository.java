package com.zippyziggy.prompt.talk.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zippyziggy.prompt.talk.model.TalkLike;

public interface TalkLikeRepository extends JpaRepository<TalkLike, Long> {
	Optional<TalkLike> findByIdAndMemberUuid(Long talkId, UUID crntMemberUuid);

	Long countAllByTalkId(Long talkId);
}
