package com.globalog.api.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Wallet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 3)
    private String currency;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal balance;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal averageExchangeRate;

    @Builder
    public Wallet(String name, String currency, BigDecimal balance, BigDecimal averageExchangeRate) {
        this.name = name;
        this.currency = currency;
        this.balance = balance;
        this.averageExchangeRate = averageExchangeRate;
    }

    public void updateBalanceAndRate(BigDecimal newBalance, BigDecimal newAverageExchangeRate) {
        this.balance = newBalance;
        this.averageExchangeRate = newAverageExchangeRate;
    }
}
