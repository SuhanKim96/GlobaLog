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

        BigDecimal currentRate = request.getExchangeRate();
        if (currentRate == null) {
            currentRate = exchangeRateService.getExchangeRate(fromCurrency, toCurrency, targetDate);
        }

        BigDecimal amount = request.getAmount();
        BigDecimal convertedAmount = amount.multiply(currentRate);

        BigDecimal newBalance;
        BigDecimal currentAvgRate = wallet.getAverageExchangeRate() != null ? wallet.getAverageExchangeRate() : BigDecimal.ZERO;
        BigDecimal newAvgRate = currentAvgRate;

        if (request.getType() == Transaction.TransactionType.DEPOSIT) {
            newBalance = wallet.getBalance().add(convertedAmount);

            if (newBalance.compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal totalValue = wallet.getBalance().multiply(currentAvgRate)
                        .add(convertedAmount.multiply(currentRate));

                newAvgRate = totalValue.divide(newBalance, 8, RoundingMode.HALF_UP);
            }
        } else if (request.getType() == Transaction.TransactionType.WITHDRAWAL) {
            newBalance = wallet.getBalance().subtract(convertedAmount);
            if (newBalance.compareTo(BigDecimal.ZERO) < 0) {
                throw new IllegalStateException("잔액이 부족하여 출금할 수 없습니다.");
            }
        } else {
            throw new IllegalArgumentException("알 수 없는 거래 유형입니다.");
        }

        wallet.updateBalanceAndRate(newBalance, newAvgRate);
        walletRepository.save(wallet);

        Transaction transaction = Transaction.builder()
                .wallet(wallet)
                .type(request.getType())
                .amount(amount)
                .exchangeRate(currentRate)
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