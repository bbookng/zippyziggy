package com.zippyziggy.notice.entity;

import lombok.*;

@Data
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Alarm {
    private String receiver;

    private String content;

    private String url;

    private Boolean isRead;
}
