package com.collincorp.houserental.dto;

import java.time.Instant;

public record MessageResponse(long id, long senderId, long recipientId, String body, Instant createdAt) {}
