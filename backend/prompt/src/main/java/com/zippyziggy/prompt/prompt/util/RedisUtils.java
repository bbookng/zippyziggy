package com.zippyziggy.prompt.prompt.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.concurrent.TimeUnit;

@Slf4j
@Component
@RequiredArgsConstructor
public class RedisUtils {

    private final RedisTemplate<String, Object> redisTemplate;

    @Resource(name = "redisTemplate")
    private ValueOperations<String, String> valueOps;

    // redis에 key, value, expiration(초 단위) 값 입력하기
    public void put(String key, Object value, Long expirationTime) {
        if (expirationTime != null) {
            redisTemplate.opsForValue().set(key, value, expirationTime, TimeUnit.SECONDS);
        } else {
            redisTemplate.opsForValue().set(key, value);
        }
    }

    // redis에서 key에 해당 하는 값 지우기(delete가 아닌 unlink 사용)
    public void delete(String key) {
        // unlink는 백그라운드에서 비동기적으로 처리해 del보다 1400배 빠르다
        redisTemplate.unlink(key);
    }

    // redis에서 내용 가져오기
    public <T> T get(String key, Class<T> clazz){
        Object object = redisTemplate.opsForValue().get(key);
        log.info("object = " + object);
        if (object != null) {
            ObjectMapper objectMapper = new ObjectMapper();
            try {
                T value = objectMapper.convertValue(object, clazz);
                log.info("value = " + value);
                return value;
            } catch (Exception e) {
                log.error("Redis 추출 에러 발생 = " + e);
                return null;
            }
        }
        return null;
    }

    // redis에 해당 값이 존재하는지 확인
    public boolean isExists(String key) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }

    // 해당 key에 만료 시간 설정하기(초 단위)
    public void setExpireTime(String key, long expirationTime) {
        redisTemplate.expire(key, expirationTime, TimeUnit.SECONDS);
    }

    // 해당 key의 만료 시간 가져오기
    public long getExpireTime(String key) {
        try {
            Long expireTime = redisTemplate.getExpire(key, TimeUnit.SECONDS);
            return expireTime;
        } catch (NullPointerException e) {
            throw new NullPointerException("만료 시간이 설정되어 있지 않습니다.");
        }
    }

}
