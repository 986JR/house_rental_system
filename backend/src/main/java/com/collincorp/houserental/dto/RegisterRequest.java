package com.collincorp.houserental.dto;

import com.collincorp.houserental.domain.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank @Email String email,
        @NotBlank @Size(min = 6, max = 128) String password,
        @Size(max = 255) String fullName,
        UserRole role) {}
