package com.zippyziggy.search.dto.response;

import com.zippyziggy.search.model.EsPrompt;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import lombok.Data;

@Data
public class SearchPromptList {

    public static SearchPromptList of(Long totalPromptsCnt, Integer totalPageCnt, List<SearchPrompt> searchPrompts) {
        return new SearchPromptList(totalPromptsCnt, totalPageCnt, searchPrompts);
    }

    private final Long totalPromptsCnt;
    private final Integer totalPageCnt;
    private final List<SearchPrompt> searchPromptList;

}
