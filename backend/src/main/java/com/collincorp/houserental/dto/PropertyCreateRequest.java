package com.collincorp.houserental.dto;

import com.collincorp.houserental.domain.PropertyAvailability;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record PropertyCreateRequest(
        @NotBlank @Size(max = 255) String title,
        @Size(max = 8000) String description,
        @NotBlank @Size(max = 512) String location,
        @NotNull @DecimalMin("0.0") BigDecimal pricePerMonth,
        @NotNull @Min(0) Integer rooms,
        PropertyAvailability availability) {}
