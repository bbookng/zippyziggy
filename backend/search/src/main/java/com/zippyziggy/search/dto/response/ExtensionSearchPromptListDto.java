package com.zippyziggy.search.dto.response;

import com.zippyziggy.search.model.EsPrompt;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;

@Data
public class ExtensionSearchPromptListDto {
    public static ExtensionSearchPromptListDto of(List<EsPrompt> esPrompts) {
        final List<ExtensionSearchPromptDto> dtos = esPrompts.stream()
                .map(ExtensionSearchPromptDto::of)
                .collect(Collectors.toList());
        return new ExtensionSearchPromptListDto(dtos);
    }

    private final List<ExtensionSearchPromptDto> extensionSearchPromptDtoList;

}
