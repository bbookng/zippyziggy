package com.zippyziggy.member.service;

import com.zippyziggy.member.model.VisitedMemberCount;
import com.zippyziggy.member.repository.VisitedMemberCountRepository;
import com.zippyziggy.member.util.RedisUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class VisitedMemberCountService {

    private final VisitedMemberCountRepository visitedMemberCountRepository;
    private final RedisUtils redisUtils;

    /**
     * 일일 방문자 수
     */
    public static String DateTimeDaily() {

        ZoneId zoneId = ZoneId.of("Asia/Seoul");
        ZonedDateTime zonedDateTime = ZonedDateTime.now(zoneId);
        log.info("zondeDateTime = " + zonedDateTime);
        DateTimeFormatter formatter = DateTimeFormatter
                .ofPattern("yyyy-MM-dd");
        formatter.withLocale(Locale.KOREA);
        String nowDateDaily = zonedDateTime.format(formatter);
        log.info("nowDateDaily = " + nowDateDaily);

        return nowDateDaily;
    }


    // 1분마다 총 방문자 수 저장
    @Scheduled(cron = "0 1 * * * *")
    @Transactional
    public void VisitedTotalCountMemberScheduler() {

        // 현재 DB에 있는 총 방문자 수 조회
        VisitedMemberCount totalMemberCount = visitedMemberCountRepository.findByNowDate("0000-00-00");

        // 누적 방문자 수 업데이트
        // redis에 총 방문자 수가 있을 경우
        if (redisUtils.isExists("totalMemberCount")) {

            // redis에 저장되어 있는 총 방문자 수
            Long totalCount = redisUtils.get("visitedTotalMemberCount", Long.class);

            if (totalMemberCount == null) {
                // DB에 방문자 수 기록이 없다면 바로 저장
                VisitedMemberCount visitedMemberTotalCount = VisitedMemberCount.builder()
                        .nowDate("0000-00-00")
                        .visitedCount(totalCount).build();
                visitedMemberCountRepository.save(visitedMemberTotalCount);
            } else {
                // 있으면 최신 방문자수로 업데이트
                totalMemberCount.setVisitedCount(totalCount);
                redisUtils.put("visitedTotalMemberCount", totalMemberCount.getVisitedCount(), 60 * 11L);
            }
        } else {
            // redis에 내용이 없는 경우
            // 첫 실행이거나 중간에 Redis가 다운된 경우가 해당된다.
            if (totalMemberCount == null) {
                // DB에 값이 없으면 완전 처음인 경우(첫 실행에 스케쥴 시간까지 방문자가 없는 경우)
                // 방문자가 없으므로 0을 반환
                VisitedMemberCount visitedMemberTotalCount = VisitedMemberCount.builder()
                        .nowDate("0000-00-00")
                        .visitedCount(0L).build();
                visitedMemberCountRepository.save(visitedMemberTotalCount);
            } else {
                // DB에 데이터가 있는데 Redis가 다운되었을 경우가 있음
                // 이때는 DB의 총 조회 수를 업데이트 해준다.
                redisUtils.put("visitedTotalMemberCount", totalMemberCount.getVisitedCount(), 60 * 60 * 24L);
            }
        }




    }
}
