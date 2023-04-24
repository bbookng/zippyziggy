package com.zippyziggy.gateway.filter;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;

@Component
public class RemoveAuthorizationHeaderFilter extends AbstractGatewayFilterFactory {

	@Override
	public GatewayFilter apply(Object config) {
		return (exchange, chain) -> {
			exchange.getRequest().getHeaders().remove(HttpHeaders.AUTHORIZATION);
			return chain.filter(exchange);
		};
	}
}
