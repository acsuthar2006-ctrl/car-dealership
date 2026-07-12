package com.incubyte.dealership.vehicle.service;

import com.incubyte.dealership.vehicle.dto.VehicleRequest;
import com.incubyte.dealership.vehicle.dto.VehicleResponse;
import com.incubyte.dealership.vehicle.entity.Vehicle;
import com.incubyte.dealership.vehicle.repository.VehicleRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class VehicleServiceTest {

    @Mock
    private VehicleRepository vehicleRepository;

    @InjectMocks
    private VehicleService vehicleService;

    @Test
    void addVehicle_withValidRequest_createsVehicleWithOneStock() {
        // ARRANGE
        var request = new VehicleRequest("Toyota", "Camry", "SEDAN", 25000.00, 1);
        UUID generatedId = UUID.randomUUID();

        Vehicle savedVehicle = Vehicle.builder()
                .id(generatedId)
                .make("Toyota")
                .model("Camry")
                .category("SEDAN")
                .price(25000.00)
                .quantityInStock(1)
                .build();

        when(vehicleRepository.existsByMakeIgnoreCaseAndModelIgnoreCase("Toyota", "Camry")).thenReturn(false);
        when(vehicleRepository.save(any(Vehicle.class))).thenReturn(savedVehicle);

        // ACT
        VehicleResponse response = vehicleService.addVehicle(request);

        // ASSERT
        ArgumentCaptor<Vehicle> vehicleCaptor = ArgumentCaptor.forClass(Vehicle.class);
        verify(vehicleRepository).save(vehicleCaptor.capture());
        Vehicle capturedVehicle = vehicleCaptor.getValue();

        assertEquals(1, capturedVehicle.getQuantityInStock(), "New vehicles should start with 1 stock");
        assertEquals(1, response.quantityInStock(), "Response should show 1 stock");
    }

    @Test
    void addVehicle_withDuplicateMakeAndModel_throwsException() {
        // ARRANGE
        var request = new VehicleRequest("Toyota", "Camry", "SEDAN", 25000.00, 1);
        when(vehicleRepository.existsByMakeIgnoreCaseAndModelIgnoreCase("Toyota", "Camry")).thenReturn(true);

        // ACT + ASSERT
        org.junit.jupiter.api.Assertions.assertThrows(
                com.incubyte.dealership.vehicle.exception.VehicleAlreadyExistsException.class,
                () -> vehicleService.addVehicle(request));
    }
}
