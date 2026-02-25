package com.globalog.api.dto;

import com.globalog.api.domain.Transaction;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Getter
@NoArgsConstructor
public class TransactionRequest {
    private Transaction.TransactionType type;
    private BigDecimal amount;
    private BigDecimal exchangeRate;
}
