package com.zippyziggy.prompt.prompt.repository;

import com.zippyziggy.prompt.prompt.model.StatusCode;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.zippyziggy.prompt.prompt.model.Prompt;

public interface PromptRepository extends JpaRepository<Prompt, Long> {

	@Modifying
	@Query("update Prompt set hit = hit + 1 where id = :promptId")
	int updateHit(@Param(value = "promptId") Long promptId);

	Optional<Prompt> findByPromptUuidAndStatusCode(UUID promptUuid, StatusCode statusCode);

	Page<Prompt> findAllByOriginPromptUuidAndStatusCode(UUID promptUuid, StatusCode statusCode, Pageable pageable);

	Page<Prompt> findAllByMemberUuidAndStatusCode(UUID memberUuid, StatusCode statusCode, Pageable pageable);

	Long countAllByOriginPromptUuidAndStatusCode(UUID promptUuid, StatusCode statusCode);
}
