package com.zippyziggy.notice.repository;

import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;

public interface AlarmRepository {

    SseEmitter save(String emitterId, SseEmitter sseEmitter);
    Map<String, SseEmitter> findAllEmitterByMemberUuid(String memberUuid);

    void deleteAllEmitterStartWithMemberUuid(String memberUuid);

    void deleteByEmitterId(String emitterId);


    // 캐쉬 관련 인터페이스
    void saveEventCache(String eventCacheId, Object event);

    Map<String, Object> findAllEventCacheByMemberUuid(String memberUuid);

    Map<String, SseEmitter> findAllEmitters();

    Map<String, Object> findAllCacheEmitters();
}
