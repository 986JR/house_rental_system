package com.collincorp.houserental.dto;

import java.util.List;

public record PagedResponse<T>(List<T> content, long totalElements, int totalPages, int number, int size) {}
