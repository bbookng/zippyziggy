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

//    @Query("{\n" +
//            "  \"sort\": [\n" +
//            "    { \"reg_dt\": \"desc\" }\n" +
//            "  ],\n" +
//            "  \"query\": {\n" +
//            "    \"bool\": {\n" +
//            "      \"must\": {\n" +
//            "          \"match\": {\n" +
//            "            \"prefix\": {\n" +
//            "            \"query\": \"?0\",\n" +
//            "            \"fuzziness\": \"AUTO\",\n" +
//            "            \"operator\": \"or\"\n" +
//            "            }\n" +
//            "          }\n" +
//            "        },\n" +
//            "      \"filter\": {\n" +
//            "        \"term\": { \n" +
//            "          \"category\": \"?1\" \n" +
//            "        }\n" +
//            "      }\n" +
//            "    }\n" +
//            "  }\n" +
//            "}"
//    )
    @Query("{\"multi_match\": { \"query\" : \"?0\", \"fields\": [ \"title\", \"description\", \"prefix\", \"suffix\", \"example\" ]}}")
    Page<EsPrompt> findByKeywordAndCategory(String keyword, Pageable pageable);

    Page<EsPrompt> findByCategory(String category, Pageable pageable);

    Page<EsPrompt> findByTitleContainsOrDescriptionContainsOrPrefixContainsOrSuffixContainsOrExampleContains(
        String keyword1, String keyword2, String keyword3, String keyword4, String keyword5, Pageable pageable
    );

}
