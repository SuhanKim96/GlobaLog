package com.globalog.api.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class WalletCreateRequest {
    private String name;
    private String currency;
}
