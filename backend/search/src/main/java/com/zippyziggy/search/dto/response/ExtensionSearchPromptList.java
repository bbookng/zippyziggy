package com.zippyziggy.search.dto.response;

import com.zippyziggy.search.model.EsPrompt;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;

@Data
public class ExtensionSearchPromptList {
    public static ExtensionSearchPromptList of(Page<EsPrompt> esPrompts) {
        final List<ExtensionSearchPrompt> dtos = esPrompts.stream()
                .map(ExtensionSearchPrompt::of)
                .collect(Collectors.toList());
        return new ExtensionSearchPromptList(dtos);
    }

    private final List<ExtensionSearchPrompt> extensionSearchPromptList;

}
