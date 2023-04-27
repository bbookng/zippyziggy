package com.zippyziggy.search.client;

import com.zippyziggy.search.dto.response.Prompt;
import com.zippyziggy.search.dto.response.PromptComment;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@FeignClient(name = "prompt")
public interface PromptClient {
    @GetMapping("/prompts/{promptUuid}")
    Optional<Prompt> getPromptDetail(@PathVariable UUID promptUuid);

    @GetMapping("/prompts/{promptUuid}/comments")
    List<PromptComment> getPromptComments(@PathVariable UUID promptUuid);

    @GetMapping("/prompts/{promptUuid}/talks")
    List<Prompt> getTalks(@PathVariable UUID promptUuid);
}