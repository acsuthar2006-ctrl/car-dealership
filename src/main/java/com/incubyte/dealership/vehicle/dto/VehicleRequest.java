package com.incubyte.dealership.vehicle.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record VehicleRequest(
        @NotBlank String make,
        @NotBlank String model,
        @NotBlank String category,
        @Positive double price,
        int quantityInStock) {
}
