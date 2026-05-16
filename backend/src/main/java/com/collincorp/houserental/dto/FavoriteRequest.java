package com.collincorp.houserental.dto;

import jakarta.validation.constraints.NotNull;

public record FavoriteRequest(@NotNull Long propertyId) {}
