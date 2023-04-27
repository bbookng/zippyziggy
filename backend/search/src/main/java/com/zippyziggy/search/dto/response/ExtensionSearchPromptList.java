package com.zippyziggy.search.dto.response;

import com.zippyziggy.search.model.EsPrompt;
import javax.persistence.criteria.CriteriaBuilder.In;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;

@Data
public class ExtensionSearchPromptList {
    public static ExtensionSearchPromptList of(Long totalPromptsCnt, Integer totalPageCnt, List<EsPrompt> esPrompts) {
        final List<ExtensionSearchPrompt> dtos = esPrompts.stream()
                .map(ExtensionSearchPrompt::of)
                .collect(Collectors.toList());
        return new ExtensionSearchPromptList(totalPromptsCnt, totalPageCnt, dtos);
    }

    private final Long totalPromptsCnt;
    private final Integer totalPageCnt;
    private final List<ExtensionSearchPrompt> extensionSearchPromptList;

}
