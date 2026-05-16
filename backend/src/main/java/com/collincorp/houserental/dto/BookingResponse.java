package com.collincorp.houserental.dto;

import java.time.Instant;
import java.time.LocalDate;

public record BookingResponse(
        long id,
        long propertyId,
        String propertyTitle,
        long tenantId,
        String tenantEmail,
        String status,
        LocalDate startDate,
        LocalDate endDate,
        String message,
        Instant createdAt) {}
