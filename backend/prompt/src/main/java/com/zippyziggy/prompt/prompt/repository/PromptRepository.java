package com.zippyziggy.prompt.prompt.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zippyziggy.prompt.prompt.model.Prompt;

public interface PromptRepository extends JpaRepository<Prompt, Long> {
}
