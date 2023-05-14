package com.zippyziggy.member;

import com.zippyziggy.member.dto.response.MemberInformResponseDto;
import com.zippyziggy.member.util.RedisUtils;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.scheduling.annotation.Scheduled;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.Set;

@SpringBootTest
@EnableCaching
class MemberApplicationTests {

	@Autowired
	private RedisUtils redisUtils;

	@Autowired
	private RedisTemplate<String, String> redisTemplate;

	@Test
	void contextLoads() {
	}


	@Test
	void test() {
		ZoneId zoneId = ZoneId.of("Asia/Seoul");
		ZonedDateTime zonedDateTime = ZonedDateTime.now(zoneId);
		System.out.println(zonedDateTime);
		DateTimeFormatter formatter = DateTimeFormatter
				.ofPattern("yyyy-MM-dd");
		formatter.withLocale(Locale.KOREA);
		String nowDateDaily = zonedDateTime.format(formatter);
		System.out.println("nowDate = " + nowDateDaily);
	}

	@Test
	void testtest() {
		MemberInformResponseDto dto = redisUtils.get("membera5026dad-70d0-4515-8e96-122415c6833d", MemberInformResponseDto.class);
		System.out.println("dto = " + dto);
	}

	@Test
	@Scheduled(cron = "0 1 * * * *")
	public void testestest() {
		System.out.println("꺄울");
	}

	@Test
	public void redisTest() {
		redisTemplate.opsForZSet().add("test", "value1", System.nanoTime());
		redisTemplate.opsForZSet().add("test", "value2", System.nanoTime());
		redisTemplate.opsForZSet().add("test", "value3", System.nanoTime());
		redisTemplate.opsForZSet().add("test", "value4", System.nanoTime());
		redisTemplate.opsForZSet().add("test", "value5", System.nanoTime());
		redisTemplate.opsForZSet().add("test", "value6", System.nanoTime());

		redisTemplate.opsForZSet().removeRange("test", 0, -6);

		ZSetOperations<String, String> zSetOperations = redisTemplate.opsForZSet().getOperations().opsForZSet();
		System.out.println("zSetOperations = " + zSetOperations);
		Set<ZSetOperations.TypedTuple<String>> set = redisTemplate.opsForZSet().rangeWithScores("test", 0, -1);
		System.out.println("set = " + set);

	}
}
