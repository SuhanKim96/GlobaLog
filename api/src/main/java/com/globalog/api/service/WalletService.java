package com.globalog.api.service;

import com.globalog.api.domain.Transaction;
import com.globalog.api.domain.Wallet;
import com.globalog.api.repository.TransactionRepository;
import com.globalog.api.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
public class WalletService {

    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;

    @Transactional
    public Transaction processTransaction(Long walletId, Transaction.TransactionType type, BigDecimal amount, BigDecimal exchangeRate) {

        Wallet wallet = walletRepository.findById(walletId)
                .orElseThrow(() -> new IllegalArgumentException("해당 지갑을 찾을 수 없습니다: " + walletId));

        BigDecimal newBalance = wallet.getBalance();
        BigDecimal newAverageRate = wallet.getAverageExchangeRate();

        if (type == Transaction.TransactionType.DEPOSIT) {
            BigDecimal oldTotalCost = wallet.getBalance().multiply(wallet.getAverageExchangeRate());
            BigDecimal newDepositCost = amount.multiply(exchangeRate);

            newBalance = wallet.getBalance().add(amount);

            if (newBalance.compareTo(BigDecimal.ZERO) > 0) {
                newAverageRate = oldTotalCost.add(newDepositCost)
                        .divide(newBalance, 2, RoundingMode.HALF_UP); // 소수점 2자리에서 반올림
            }
        } else if (type == Transaction.TransactionType.WITHDRAWAL) {
            newBalance = wallet.getBalance().subtract(amount);
            if (newBalance.compareTo(BigDecimal.ZERO) < 0) {
                throw new IllegalArgumentException("계좌 잔액이 부족합니다.");
            }
        }

        wallet.updateBalanceAndRate(newBalance, newAverageRate);

        Transaction transaction = Transaction.builder()
                .wallet(wallet)
                .type(type)
                .amount(amount)
                .exchangeRate(type == Transaction.TransactionType.DEPOSIT ? exchangeRate : BigDecimal.ZERO)
                .build();

        return transactionRepository.save(transaction);
    }

    @Transactional(readOnly = true)
    public Wallet getWallet(Long walletId) {
        return walletRepository.findById(walletId)
                .orElseThrow(() -> new IllegalArgumentException("해당 지갑을 찾을 수 없습니다: " + walletId));
    }
}