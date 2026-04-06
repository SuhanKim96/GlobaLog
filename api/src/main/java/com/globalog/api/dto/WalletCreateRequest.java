package com.globalog.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class WalletCreateRequest {

    @NotBlank(message = "Wallet name is required")
    @Size(max = 100, message = "Wallet name must not exceed 100 characters")
    private String name;

    @NotBlank(message = "Currency code is required")
    @Pattern(regexp = "^[A-Z]{3}$", message = "Currency must be a 3-letter ISO 4217 code (e.g. USD, SGD)")
    private String currency;
}
