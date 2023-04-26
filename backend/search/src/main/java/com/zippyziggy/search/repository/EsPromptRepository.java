package com.zippyziggy.search.repository;

import com.zippyziggy.search.model.EsPrompt;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EsPromptRepository extends ElasticsearchRepository<EsPrompt, String> {

    Page<EsPrompt> findByKeywordAndCategory(String keyword, String category);

    Page<EsPrompt> findByCategory(String category, Pageable pageable);

    Page<EsPrompt> findByTitleContainsOrDescriptionContainsOrPrefixContainsOrSuffixContainsOrExampleContains(
        String keyword1, String keyword2, String keyword3, String keyword4, String keyword5, Pageable pageable
    );


}
