package com.zippyziggy.search.dto.response.server;

import lombok.Data;

@Data
public class CntResponse {
    private final Integer talkCnt;
    private final Integer commentCnt;
}
