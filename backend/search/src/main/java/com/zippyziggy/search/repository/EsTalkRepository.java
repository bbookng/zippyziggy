package com.zippyziggy.search.repository;

import com.zippyziggy.search.model.EsTalk;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EsTalkRepository extends ElasticsearchRepository<EsTalk, String> {

    @Query("{\"bool\": {\"must\": [{\"multi_match\": {\"query\": \"?0\", \"fields\": [\"title\", \"es_messages.content\"]}}]}}")
    Page<EsTalk> findByKeywordOnly(String keyword, Pageable pageable);

    Optional<EsTalk> findEsTalkByTalkId(Long talkId);

}
