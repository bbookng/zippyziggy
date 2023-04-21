package com.zippyziggy.search.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import co.elastic.clients.json.jackson.JacksonJsonpMapper;
import co.elastic.clients.transport.ElasticsearchTransport;
import co.elastic.clients.transport.rest_client.RestClientTransport;
import com.zippyziggy.search.model.EsPrompt;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpHost;
import org.elasticsearch.client.RestClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@RequiredArgsConstructor
@Service
@Transactional
public class EsPromptService {


    // Create the low-level client
    RestClient restClient = RestClient.builder(
        new HttpHost("localhost", 9200)).build();

    // Create the transport with a Jackson mapper
    ElasticsearchTransport transport = new RestClientTransport(
        restClient, new JacksonJsonpMapper());

    // And create the API client
    ElasticsearchClient client = new ElasticsearchClient(transport);

    public List<EsPrompt> testSearch() throws IOException {
        SearchResponse<EsPrompt> search = client.search(s -> s
                .index("test")
                .query(q -> q
                    .queryString(qs -> qs
                        .defaultField("suffix")
                        .query("ultrices")
                    )),
            EsPrompt.class);

        final List<EsPrompt> esPrompts = new ArrayList<>();
        for (Hit<EsPrompt> hit: search.hits().hits()) {
            esPrompts.add(hit.source());
        }

        return esPrompts;
    }


}
