package com.incubyte.dealership.vehicle.dto;

import jakarta.validation.constraints.Positive;

public record VehicleRequest(
                String make,
                String model,
                String category,
                @Positive double price,
                int quantityInStock) {
}
