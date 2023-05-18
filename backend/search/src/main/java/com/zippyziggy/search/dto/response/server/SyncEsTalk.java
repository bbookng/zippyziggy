package com.zippyziggy.search.dto.response.server;

import com.zippyziggy.search.model.EsMessage;
import lombok.Data;

import java.util.List;

@Data
public class SyncEsTalk {
    private Long talkId;
    private String promptUuid;
    private String memberUuid;
    private String title;
    private Long regDt;
    private Long likeCnt;
    private Long hit;
    private String model;

    private List<EsMessage> esMessages;
}
