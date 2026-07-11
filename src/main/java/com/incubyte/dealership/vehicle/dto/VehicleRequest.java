package com.incubyte.dealership.vehicle.dto;

public record VehicleRequest(
    String make,
    String model,
    String category,
    double price,
    int quantityInStock
) {}
