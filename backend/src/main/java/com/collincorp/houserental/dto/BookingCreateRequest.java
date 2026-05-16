package com.collincorp.houserental.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record BookingCreateRequest(
        @NotNull Long propertyId,
        @NotNull LocalDate startDate,
        @NotNull LocalDate endDate,
        String message) {}
