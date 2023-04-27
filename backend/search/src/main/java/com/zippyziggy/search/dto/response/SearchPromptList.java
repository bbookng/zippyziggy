package com.zippyziggy.search.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class SearchPromptList {

    public static SearchPromptList of(Long totalPromptsCnt, Integer totalPageCnt, List<SearchPrompt> searchPrompts) {
        return new SearchPromptList(totalPromptsCnt, totalPageCnt, searchPrompts);
    }

    private final Long totalPromptsCnt;
    private final Integer totalPageCnt;
    private final List<SearchPrompt> searchPromptList;

}
