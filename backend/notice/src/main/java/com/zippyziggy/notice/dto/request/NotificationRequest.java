package com.zippyziggy.notice.dto.request;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NotificationRequest {
    private String memberUuid;
    private String content;
    private String urlValue;
}
