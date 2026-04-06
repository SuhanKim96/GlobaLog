package com.globalog.api.dto;

import com.globalog.api.domain.Transaction;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class TransactionRequest {
    private Long walletId;

    @NotNull(message = "Transaction type is required")
    private Transaction.TransactionType type;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be greater than zero")
    private BigDecimal amount;

    private String description;
    private BigDecimal exchangeRate;
    private String transactionCurrency;
    private LocalDateTime transactionDate;
}
