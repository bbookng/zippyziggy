package com.zippyziggy.prompt.talk.repository;

import com.zippyziggy.prompt.talk.model.Message;
import com.zippyziggy.prompt.talk.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, Long> {

    Message findFirstByTalkIdAndRole(Long id, Role role);
}
