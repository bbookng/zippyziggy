package com.zippyziggy.prompt.prompt.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.zippyziggy.prompt.prompt.model.Prompt;

public interface PromptRepository extends JpaRepository<Prompt, Long> {

	@Modifying
	@Query("update Prompt set hit = hit + 1 where id = :promptId")
	int updateHit(@Param(value = "promptId") Long promptId);

	Long findIdByPromptUuid(String promptUuid);

	Optional<Prompt> findByPromptUuid(String promptUuid);
}
