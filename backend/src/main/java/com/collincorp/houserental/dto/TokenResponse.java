package com.collincorp.houserental.dto;

public record TokenResponse(String accessToken, String tokenType, UserResponse user) {
    public static TokenResponse of(String accessToken, UserResponse user) {
        return new TokenResponse(accessToken, "bearer", user);
    }
}
