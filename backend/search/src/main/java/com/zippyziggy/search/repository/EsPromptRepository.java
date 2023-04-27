package com.zippyziggy.search.repository;

import com.zippyziggy.search.model.EsPrompt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EsPromptRepository extends ElasticsearchRepository<EsPrompt, String> {

    @Query("{" +
            "    \"bool\": {" +
            "        \"must\": [" +
            "            {" +
            "                \"multi_match\": {" +
            "                    \"query\": \"?0\"," +
            "                    \"fields\": [\"title\", \"description\", \"prefix\", \"suffix\", \"example\"]" +
            "                }" +
            "            }," +
            "            {" +
            "                \"match\": {" +
            "                    \"category\": \"?1\"" +
            "                }" +
            "            }" +
            "        ]" +
            "    }" +
            "}")
    Page<EsPrompt> findByKeywordAndCategory(String keyword, String category, Pageable pageable);


    @Query("{\"bool\": {\"must\": [{\"multi_match\": {\"query\": \"?0\", \"fields\": [\"title\", \"description\", \"prefix\", \"suffix\", \"example\"]}}]}}")
    Page<EsPrompt> findByKeywordOnly(String keyword, Pageable pageable);

    Page<EsPrompt> findByCategory(String category, Pageable pageable);

}
