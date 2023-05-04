package com.zippyziggy.member;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cache.annotation.EnableCaching;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@SpringBootTest
@EnableCaching
class MemberApplicationTests {

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
}
