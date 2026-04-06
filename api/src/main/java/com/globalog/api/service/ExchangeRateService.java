package com.globalog.api.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ExchangeRateService {
    private final RestTemplate restTemplate;

    public BigDecimal getExchangeRate(String from, String to, LocalDate date) {
        if (from.equals(to)) {
            return BigDecimal.ONE;
        }

        String datePath = (date != null) ? date.toString() : "latest";
        String url = String.format("https://api.frankfurter.dev/v1/%s?base=%s&symbols=%s", datePath, from, to);

        try {
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            if (response != null && response.containsKey("rates")) {
                Map<String, Double> rates = (Map<String, Double>) response.get("rates");
                if (rates.containsKey(to)) {
                    return BigDecimal.valueOf(rates.get(to));
                }
            }
            throw new RuntimeException(from + " -> " + to + " (" + datePath + ") 환율 정보를 찾을 수 없습니다.");
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException(from + " -> " + to + " 환율 정보를 가져오지 못했습니다.", e);
        }
    }
}
