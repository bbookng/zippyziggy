package com.zippyziggy.search.dto.response;

import java.util.List;
import lombok.Data;

@Data
public class SearchTalkList {

    public static SearchTalkList of(Long totalTalksCnt, Integer totalPageCnt, List<SearchTalk> searchTalkList) {
        return new SearchTalkList(totalTalksCnt, totalPageCnt, searchTalkList);
    }

    private final Long totalTalksCnt;
    private final Integer totalPageCnt;
    private final List<SearchTalk> searchTalkList;

}
