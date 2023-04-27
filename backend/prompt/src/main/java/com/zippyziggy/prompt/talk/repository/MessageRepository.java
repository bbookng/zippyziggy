package com.zippyziggy.prompt.talk.repository;

import com.zippyziggy.prompt.talk.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, Long> {

}
