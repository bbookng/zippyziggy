package com.zippyziggy.member.config;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

// AOP로 사용할 클래스
@Aspect
// 클래스를 스프링 빈으로 등록
@Component
public class TimeTraceConfig {

    // AOP를 적용할 하위 모듈들
    @Around("execution(* com.zippyziggy.member.controller..*(..))")
    public Object execute(ProceedingJoinPoint joinPoint) throws Throwable {

        long start = System.currentTimeMillis();
        System.out.println("Start: " + joinPoint.toString());

        try {
            return joinPoint.proceed();
        } finally {

            long finish = System.currentTimeMillis();
            long timeMs = finish - start;
            System.out.println("End: " + joinPoint.toString() + timeMs + "ms");
        }
    }
}
