package com.zippyziggy.prompt.talk.repository;

import com.zippyziggy.prompt.talk.model.TalkComment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TalkCommentRepository extends JpaRepository<TalkComment, Long> {
    Long countAllByTalkId(Long id);
}
