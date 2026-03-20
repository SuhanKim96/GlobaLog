package com.globalog.api.service;

import com.globalog.api.domain.Transaction;
import com.globalog.api.domain.Wallet;
import com.globalog.api.dto.TransactionRequest;
import com.globalog.api.dto.WalletCreateRequest;
import com.globalog.api.repository.TransactionRepository;
import com.globalog.api.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WalletService {

    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;
    private final ExchangeRateService exchangeRateService;

    @Transactional
    public Transaction processTransaction(TransactionRequest request) {
        Wallet wallet = walletRepository.findById(request.getWalletId())
                .orElseThrow(() -> new IllegalArgumentException("지갑을 찾을 수 없습니다."));

        String fromCurrency = (request.getTransactionCurrency() != null) ? request.getTransactionCurrency() : "USD";
        String toCurrency = wallet.getCurrency();

        LocalDate targetDate = request.getTransactionDate() != null ? request.getTransactionDate().toLocalDate() : LocalDate.now();

        // 1. 거래 통화 -> 지갑 통화 환율 (잔액 계산용)
        BigDecimal rateFromToWallet = request.getExchangeRate();
        if (rateFromToWallet == null) {
            rateFromToWallet = exchangeRateService.getExchangeRate(fromCurrency, toCurrency, targetDate);
        }

        // 2. 거래 통화 -> KRW 환율 (원화 가치 및 평균 환율 계산용)
        BigDecimal rateFromToKRW = exchangeRateService.getExchangeRate(fromCurrency, "KRW", targetDate);

        BigDecimal amount = request.getAmount();
        BigDecimal convertedAmount = amount.multiply(rateFromToWallet); // 지갑 통화 기준 입금액
        BigDecimal amountInKRW = amount.multiply(rateFromToKRW);      // KRW 기준 가치

        BigDecimal newBalance;
        BigDecimal newAvgRate = wallet.getAverageExchangeRate() != null ? wallet.getAverageExchangeRate() : BigDecimal.ONE;

        if (request.getType() == Transaction.TransactionType.DEPOSIT) {
            newBalance = wallet.getBalance().add(convertedAmount);

            if (newBalance.compareTo(BigDecimal.ZERO) > 0) {
                // 기존 총 원화 가치 계산 (기존 잔액 / 기존 평균환율)
                BigDecimal currentTotalKRW = BigDecimal.ZERO;
                if (wallet.getBalance().compareTo(BigDecimal.ZERO) > 0 && wallet.getAverageExchangeRate().compareTo(BigDecimal.ZERO) > 0) {
                    currentTotalKRW = wallet.getBalance().divide(wallet.getAverageExchangeRate(), 18, RoundingMode.HALF_UP);
                }

                BigDecimal newTotalKRW = currentTotalKRW.add(amountInKRW);
                // 새로운 평균 환율 = 새로운 잔액 / 새로운 총 원화 가치
                newAvgRate = newBalance.divide(newTotalKRW, 8, RoundingMode.HALF_UP);
            }
        } else if (request.getType() == Transaction.TransactionType.WITHDRAWAL) {
            newBalance = wallet.getBalance().subtract(convertedAmount);
            if (newBalance.compareTo(BigDecimal.ZERO) < 0) {
                throw new IllegalStateException("잔액이 부족하여 출금할 수 없습니다.");
            }
            // 출금 시에는 평균 환율이 변하지 않음 (평균 단가 개념)
        } else {
            throw new IllegalArgumentException("알 수 없는 거래 유형입니다.");
        }

        wallet.updateBalanceAndRate(newBalance, newAvgRate);
        walletRepository.save(wallet);

        Transaction transaction = Transaction.builder()
                .wallet(wallet)
                .type(request.getType())
                .amount(amount)
                .exchangeRate(rateFromToWallet)
                .description(request.getDescription())
                .currency(fromCurrency)
                .transactionDate(request.getTransactionDate() != null ? request.getTransactionDate() : LocalDateTime.now())
                .build();

        return transactionRepository.save(transaction);
    }

    @Transactional(readOnly = true)
    public Wallet getWallet(Long walletId) {
        return walletRepository.findById(walletId)
                .orElseThrow(() -> new IllegalArgumentException("해당 지갑을 찾을 수 없습니다: " + walletId));
    }

    @Transactional(readOnly = true)
    public List<Wallet> getAllWallets() {
        return walletRepository.findAll();
    }

    @Transactional
    public Wallet createWallet(WalletCreateRequest request) {
        Wallet newWallet = Wallet.builder()
                .name(request.getName())
                .currency(request.getCurrency())
                .balance(BigDecimal.ZERO)
                .averageExchangeRate(BigDecimal.ONE)
                .build();

        return walletRepository.save(newWallet);
    }

    @Transactional(readOnly = true)
    public List<Transaction> getTransactions(Long walletId) {
        return transactionRepository.findByWalletIdOrderByCreatedAtDesc(walletId);
    }
}