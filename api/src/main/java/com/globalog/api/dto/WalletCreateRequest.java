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

    @NotBlank(message = "통장 이름을 입력해주세요.")
    @Size(max = 100, message = "통장 이름은 100자를 초과할 수 없습니다.")
    private String name;

    @NotBlank(message = "통화 코드를 입력해주세요.")
    @Pattern(regexp = "^[A-Z]{3}$", message = "통화 코드는 3자리 ISO 4217 형식이어야 합니다. (예: USD, SGD)")
    private String currency;
}
