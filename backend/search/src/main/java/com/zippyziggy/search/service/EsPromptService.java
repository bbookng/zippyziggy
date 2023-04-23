package com.zippyziggy.search.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.json.jackson.JacksonJsonpMapper;
import co.elastic.clients.transport.ElasticsearchTransport;
import co.elastic.clients.transport.rest_client.RestClientTransport;
import com.zippyziggy.search.model.EsPrompt;
import com.zippyziggy.search.repository.EsPromptRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpHost;
import org.elasticsearch.client.RestClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Service
public class EsPromptService {

    private final EsPromptRepository esPromptRepository;

    // Create the low-level client
    RestClient restClient = RestClient.builder(
        new HttpHost("localhost", 9200)).build();

    // Create the transport with a Jackson mapper
    ElasticsearchTransport transport = new RestClientTransport(
        restClient, new JacksonJsonpMapper());

    // And create the API client
    ElasticsearchClient client = new ElasticsearchClient(transport);

    public List<EsPrompt> testSearch() {
//        SearchResponse<EsPrompt> search = client.search(s -> s
//                .index("test")
//                .query(q -> q
//                    .queryString(qs -> qs
//                        .defaultField("suffix")
//                        .query("ultrices")
//                    )),
//            EsPrompt.class);
//
//        final List<EsPrompt> esPrompts = new ArrayList<>();
//        for (Hit<EsPrompt> hit: search.hits().hits()) {
//            esPrompts.add(hit.source());
//        }

        return esPromptRepository.findBySuffixContains("ultrices");
    }


}
