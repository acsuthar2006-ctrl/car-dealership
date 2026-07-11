package com.incubyte.dealership.vehicle.exception;

import java.util.UUID;

public class OutOfStockException extends RuntimeException {
    public OutOfStockException(UUID vehicleId) {
        super("Vehicle with id " + vehicleId + " is out of stock.");
    }
}
