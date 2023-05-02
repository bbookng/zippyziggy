package com.zippyziggy.search.dto.response;

import java.util.List;
import lombok.Data;

@Data
public class SearchTalkList {

    private final Long totalTalksCnt;
    private final Integer totalPageCnt;
    private final List<SearchTalk> searchTalkList;

}
