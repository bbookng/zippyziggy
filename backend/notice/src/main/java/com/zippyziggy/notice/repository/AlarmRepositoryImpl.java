package com.zippyziggy.notice.repository;

import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Slf4j
@NoArgsConstructor
@Repository
public class AlarmRepositoryImpl implements AlarmRepository{

    private final Map<String, SseEmitter> emitters = new ConcurrentHashMap<>();
    private final Map<String, Object> eventCache = new ConcurrentHashMap<>();


    @Override
    public SseEmitter save(String emitterId, SseEmitter sseEmitter) {
        emitters.put(emitterId, sseEmitter);
        return sseEmitter;
    }

    @Override
    public Map<String, SseEmitter> findAllEmitterStartWithByMemberUuid(String memberUuid) {

        return emitters.entrySet().stream()
                .filter(entry -> entry.getKey().split("_")[0].equals(memberUuid))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }


    @Override
    public void deleteAllEmitterStartWithMemberUuid(String memberUuid) {
        emitters.forEach((key, emitter) -> {
            if (key.startsWith(memberUuid)) {
                emitters.remove(key);
            }
        });
    }

    @Override
    public void deleteByEmitterId(String emitterId) {
        emitters.remove(emitterId);
    }

    @Override
    public void saveEventCache(String eventCacheId, Object event) {
        eventCache.put(eventCacheId, event);
    }

    @Override
    public Map<String, Object> findAllEventCacheStartWithByMemberUuid(String memberUuid) {
        return eventCache.entrySet().stream()
                .filter(entry -> entry.getKey().startsWith(memberUuid))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }

    @Override
    public Map<String, SseEmitter> findAllEmitters() {
        return emitters;
    }

    @Override
    public Map<String, Object> findAllCacheEmitters() {
        return eventCache;
    }


}
