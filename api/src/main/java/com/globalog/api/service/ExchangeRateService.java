package com.globalog.api.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ExchangeRateService {
    private final RestTemplate restTemplate;

    public BigDecimal getLatestRate(String from, String to) {
        String url = String.format("https://api.frankfurter.dev/v1/latest?base=%s&symbols=%s", from, to);

        try {
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            Map<String, Object> rates = (Map<String, Object>) response.get("rates");

            Number rate = (Number) rates.get(to);
            return BigDecimal.valueOf(rate.doubleValue());
        } catch (Exception e) {
            throw new RuntimeException("환율 정보를 가져오지 못했습니다.");
        }
    }
}
