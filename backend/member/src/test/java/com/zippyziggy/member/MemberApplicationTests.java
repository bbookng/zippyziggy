package com.zippyziggy.member;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zippyziggy.member.dto.response.MemberInformResponseDto;
import com.zippyziggy.member.model.JwtToken;
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
import java.util.HashSet;
import java.util.Locale;
import java.util.Set;

@SpringBootTest
@EnableCaching
class MemberApplicationTests {

	@Autowired
	private RedisUtils redisUtils;

	@Autowired
	private RedisTemplate<String, String> redisTemplate;

	@Autowired
	private ObjectMapper objectMapper;

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
	public void redisTest() throws JsonProcessingException {
		JwtToken jwtToken = JwtToken.builder().accessToken("1234").refreshToken("5678").build();
		JwtToken jwtToken1 = JwtToken.builder().accessToken("dasf").refreshToken("zcx").build();
		String value1 = objectMapper.writeValueAsString(jwtToken);
		String value2 = objectMapper.writeValueAsString(jwtToken1);
		redisTemplate.opsForZSet().add("test2", value1, System.nanoTime());
		redisTemplate.opsForZSet().add("test2", value2, System.nanoTime());


		redisTemplate.opsForZSet().removeRange("test2", 0, -6);

		ZSetOperations<String, String> zSetOperations = redisTemplate.opsForZSet().getOperations().opsForZSet();
		System.out.println("zSetOperations = " + zSetOperations);
		Set<ZSetOperations.TypedTuple<String>> set = redisTemplate.opsForZSet().rangeWithScores("test2", 0, -1);

		for (ZSetOperations.TypedTuple<String> tuple : set) {
			String value = tuple.getValue();
			double score = tuple.getScore();
			System.out.println("Value: " + value + ", Score: " + score);
			JwtToken jwtToken2 = objectMapper.readValue(value, JwtToken.class);
			System.out.println("jwtToken2 = " + jwtToken2);
		}

		System.out.println("set = " + set);
	}

	@Test
	public void redisSetTest() {

		String key = "test";

		redisTemplate.opsForSet().add(key, "1", "2", "3");
		Set<String> members = redisTemplate.opsForSet().members(key);
		System.out.println("members = " + members);


	}

}
