package com.zippyziggy.member.service;

import com.zippyziggy.member.dto.response.MemberInformResponseDto;
import com.zippyziggy.member.util.RedisUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class RedisService {

    private final RedisUtils redisUtils;

    /**
     * redis에 refreshToken과 유저 정보를 저장
     */
    public void saveRedisData(String memberUuid, MemberInformResponseDto memberInformResponseDto, String refreshToken) {
        // 기존에 있던 redis 정보 삭제
        String MemberKey = "member" + memberUuid;
        String RefreshKey = "refreshToken" + memberUuid;

        // redis 설정(1. 유저 정보 저장 -> UUID나 AccessToken으로 회원 조회할 시 활용
        //           2. refreshToken 저장 -> accessToken 만료 시 DB가 아닌 Redis에서 먼저 찾아오기)
        // 유저 정보 Redis에 저장
        redisUtils.put(MemberKey, memberInformResponseDto, 60 * 60 * 24 * 14L); // refreshToken의 만료시간과 동일하게 설정

        // RefreshToken Redis에 저장
        redisUtils.put(RefreshKey, refreshToken, 60 * 60 * 24 * 14L);
    }


    public void deleteRedisData(String memberUuid) {

        String MemberKey = "member" + memberUuid;
        String RefreshKey = "refreshToken" + memberUuid;

        if (redisUtils.isExists(MemberKey)) {
            redisUtils.delete(MemberKey);
        }

        if (redisUtils.isExists(RefreshKey)) {
            redisUtils.delete(RefreshKey);
        }
    }
}
