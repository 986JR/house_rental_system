package com.collincorp.houserental.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record MessageCreateRequest(@NotNull Long recipientId, @NotBlank @Size(max = 8000) String body) {}
