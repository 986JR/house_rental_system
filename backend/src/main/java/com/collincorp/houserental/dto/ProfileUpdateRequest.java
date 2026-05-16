package com.collincorp.houserental.dto;

import jakarta.validation.constraints.Size;

public record ProfileUpdateRequest(
    @Size(max = 255) String fullName,
    @Size(min = 6, max = 128) String password
) {}
