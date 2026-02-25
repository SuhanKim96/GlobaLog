package com.globalog.api.controller;

import com.globalog.api.domain.Transaction;
import com.globalog.api.domain.Wallet;
import com.globalog.api.dto.TransactionRequest;
import com.globalog.api.dto.WalletCreateRequest;
import com.globalog.api.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/wallets")
@RequiredArgsConstructor
public class WalletController {
    private final WalletService walletService;

    @PostMapping("/{walletId}/transactions")
    public ResponseEntity<Transaction> createTransaction(@PathVariable Long walletId, @RequestBody TransactionRequest request) {
        request.setWalletId(walletId);
        Transaction transaction = walletService.processTransaction(request);

        return ResponseEntity.ok(transaction);
    }

    @GetMapping("/{walletId}")
    public ResponseEntity<Wallet> getWallet(@PathVariable Long walletId) {
        Wallet wallet = walletService.getWallet(walletId);

        return ResponseEntity.ok(wallet);
    }

    @GetMapping("/{walletId}/transactions")
    public ResponseEntity<List<Transaction>> getTransactions(@PathVariable Long walletId) {
        List<Transaction> transactions = walletService.getTransactions(walletId);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping
    public ResponseEntity<List<Wallet>> getAllWallets() {
        List<Wallet> wallets = walletService.getAllWallets();
        return ResponseEntity.ok(wallets);
    }

    @PostMapping
    public ResponseEntity<Wallet> createWallet(@RequestBody WalletCreateRequest request) {
        Wallet wallet = walletService.createWallet(request);
        return ResponseEntity.ok(wallet);
    }
}
