package com.zippyziggy.prompt.prompt.repository;

import com.zippyziggy.prompt.prompt.model.Category;
import com.zippyziggy.prompt.prompt.model.StatusCode;
import java.util.List;
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

    List<Prompt> findByTitleContainsOrDescriptionContainsOrPrefixContainsOrSuffixContainsOrExampleContains(
        String title, String description, String prefix, String suffix, String example,
        Pageable pageable);

    @Modifying
    @Query("update Prompt set hit = hit + 1 where id = :promptId")
    int updateHit(@Param(value = "promptId") Long promptId);

    Optional<Prompt> findByPromptUuidAndStatusCode(UUID promptUuid, StatusCode statusCode);

    Optional<Prompt> findByOriginPromptUuidAndPromptUuid(UUID originPromptUuid, UUID promptUuid);

    Optional<Prompt> findByPromptUuid(UUID promptUuid);

    Page<Prompt> findAllByOriginPromptUuidAndStatusCode(UUID promptUuid, StatusCode statusCode, Pageable pageable);

    Page<Prompt> findAllByMemberUuidAndStatusCode(UUID memberUuid, StatusCode statusCode, Pageable pageable);

    Long countAllByOriginPromptUuidAndStatusCode(UUID promptUuid, StatusCode statusCode);

    List<Prompt> findByStatusCode(StatusCode statusCode);

    long count();

    long countAllByMemberUuidAndCategory(UUID memberUuid, Category category);

    List<Prompt> findAllByCategoryIn(List<String> categories );
}
