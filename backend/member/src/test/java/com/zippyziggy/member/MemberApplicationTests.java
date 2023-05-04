package com.zippyziggy.member;

import com.zippyziggy.member.dto.response.MemberInformResponseDto;
import com.zippyziggy.member.util.RedisUtils;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cache.annotation.EnableCaching;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@SpringBootTest
@EnableCaching
class MemberApplicationTests {

	@Autowired
	private RedisUtils redisUtils;

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
}
