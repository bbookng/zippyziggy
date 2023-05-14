package com.zippyziggy.notice.dto.response;

import lombok.Builder;
import lombok.Data;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;

@Data
@Builder
public class EmittersResponse {

    private Map<String, SseEmitter> emitters;
    private Map<String, Object> eventCache;
}
