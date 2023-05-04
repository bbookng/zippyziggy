package com.zippyziggy.member.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisSentinelConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {

    @Value("${spring.redis.host}")
    private String host;

    @Value("${spring.redis.port}")
    private int port;

    @Bean
    public RedisConnectionFactory redisConnectionFactory() {

//        RedisStandaloneConfiguration redisStandaloneConfiguration = new RedisStandaloneConfiguration();
//        redisStandaloneConfiguration.setHostName(host);
//        redisStandaloneConfiguration.setPort(port);
//        redisStandaloneConfiguration.setPassword(password);
//        return new LettuceConnectionFactory(redisStandaloneConfiguration);

        RedisSentinelConfiguration redisSentinelConfiguration = new RedisSentinelConfiguration();
        redisSentinelConfiguration.master("mymaster")
                .sentinel("zippyziggy.kr", 5000)
                .sentinel("zippyziggy.kr", 5001)
                .sentinel("zippyziggy.kr", 5002);

        return new LettuceConnectionFactory(redisSentinelConfiguration);
    }


    @Bean
    public RedisTemplate<String, Object> redisTemplate() {

        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(redisConnectionFactory());
        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setValueSerializer(new Jackson2JsonRedisSerializer<>(Object.class));

        return redisTemplate;

    }

}
