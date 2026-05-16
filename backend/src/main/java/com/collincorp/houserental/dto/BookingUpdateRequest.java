package com.collincorp.houserental.dto;

import com.collincorp.houserental.domain.BookingStatus;
import jakarta.validation.constraints.NotNull;

public record BookingUpdateRequest(@NotNull BookingStatus status) {}
