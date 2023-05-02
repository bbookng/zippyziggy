package com.zippyziggy.search.service;

import com.zippyziggy.search.client.PromptClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.client.circuitbreaker.CircuitBreakerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Service
public class EsTalkService {
    private final CircuitBreakerFactory circuitBreakerFactory;
    private final PromptClient promptClient;

}
