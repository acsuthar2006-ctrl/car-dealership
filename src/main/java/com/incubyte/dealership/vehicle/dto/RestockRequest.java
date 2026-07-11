package com.incubyte.dealership.vehicle.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record RestockRequest(
                @NotNull @Min(value = 1) int quantity) {
}
