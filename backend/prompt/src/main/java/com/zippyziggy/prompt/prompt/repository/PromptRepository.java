package com.zippyziggy.prompt.prompt.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.zippyziggy.prompt.prompt.model.PromptReport;
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

	Optional<Prompt> findByPromptUuid(UUID promptUuid);

	Page<Prompt> findAllByOriginPromptUuid(UUID promptUuid, Pageable pageable);

	Page<Prompt> findAllByMemberUuid(UUID memberUuid, Pageable pageable);

	List<Prompt> findAllByOriginPromptUuid(UUID promptUuid);

	Long countAllByOriginPromptUuid(UUID promptUuid);


//	List<Prompt> findAllByMemberUuid(UUID memberUuid);
}
