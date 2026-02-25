package com.globalog.api.dto;

import com.globalog.api.domain.Transaction;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class TransactionRequest {
    private Long walletId;
    private Transaction.TransactionType type;
    private BigDecimal amount;
    private String description;
    private BigDecimal exchangeRate;
    private String transactionCurrency;
}
