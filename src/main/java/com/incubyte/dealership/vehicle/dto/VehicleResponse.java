package com.incubyte.dealership.vehicle.dto;

import java.util.UUID;

public record VehicleResponse(
    UUID id,
    String make,
    String model,
    String category,
    double price,
    int quantityInStock
) {}
