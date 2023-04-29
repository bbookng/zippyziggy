package com.zippyziggy.prompt.talk.repository;

import com.zippyziggy.prompt.talk.model.TalkComment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TalkCommentRepository extends JpaRepository<TalkComment, Long> {
    Long countAllByTalk_Id(Long id);

    Page<TalkComment> findAllByTalk_Id(Long talkId, Pageable pageable);
}
