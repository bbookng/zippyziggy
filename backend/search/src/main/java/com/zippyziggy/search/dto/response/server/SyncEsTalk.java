package com.zippyziggy.search.dto.response.server;

import com.zippyziggy.search.model.EsMessage;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class SyncEsTalk {

    private Long talkId;
    private UUID promptUuid;
    private String memberUuid;
    private String title;
    private Long regDt;
    private Long likeCnt;
    private Long hit;

    private List<EsMessage> esMessages;


}
