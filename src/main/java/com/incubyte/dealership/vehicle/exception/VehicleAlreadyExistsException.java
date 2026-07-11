package com.incubyte.dealership.vehicle.exception;

public class VehicleAlreadyExistsException extends RuntimeException {
    public VehicleAlreadyExistsException(String make, String model) {
        super("Vehicle already exists with make: " + make + " and model: " + model);
    }
}
