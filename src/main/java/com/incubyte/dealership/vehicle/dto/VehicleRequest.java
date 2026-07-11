package com.incubyte.dealership.vehicle.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

public record VehicleRequest(
               @NotBlank String make,
               @NotBlank String model,
               @NotBlank String category,
               @Positive double price,
               @PositiveOrZero int quantityInStock) {
}
