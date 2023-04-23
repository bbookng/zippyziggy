package com.zippyziggy.search.repository;

import com.zippyziggy.search.model.EsPrompt;
import java.util.List;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EsPromptRepository extends ElasticsearchRepository<EsPrompt, String> {

    List<EsPrompt> findBySuffixContains(String suffix);
}
