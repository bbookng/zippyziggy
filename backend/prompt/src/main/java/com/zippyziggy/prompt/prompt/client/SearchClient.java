package com.zippyziggy.prompt.prompt.client;

import com.zippyziggy.prompt.prompt.dto.request.EsPromptRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name="search")
public interface SearchClient {
    @PostMapping("/sync/prompts")
    Void insertEsPrompt(@RequestBody EsPromptRequest esPromptRequest);

    @PutMapping("/sync/prompts")
    Void modifyEsPrompt(@RequestBody EsPromptRequest esPromptRequest);

    @DeleteMapping("/sync/prompts/{promptsUuid}")
    Void deleteEsPrompt(@PathVariable String promptsUuid);
}