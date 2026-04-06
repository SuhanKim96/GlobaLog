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

    @NotNull(message = "거래 유형을 선택해주세요.")
    private Transaction.TransactionType type;

    @NotNull(message = "금액을 입력해주세요.")
    @Positive(message = "금액은 0보다 커야 합니다.")
    private BigDecimal amount;

    private String description;
    private BigDecimal exchangeRate;
    private String transactionCurrency;
    private LocalDateTime transactionDate;
}
