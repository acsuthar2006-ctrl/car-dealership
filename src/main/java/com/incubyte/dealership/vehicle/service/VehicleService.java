package com.incubyte.dealership.vehicle.service;

import com.incubyte.dealership.vehicle.dto.VehicleRequest;
import com.incubyte.dealership.vehicle.dto.VehicleResponse;
import com.incubyte.dealership.vehicle.entity.Vehicle;
import com.incubyte.dealership.vehicle.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    @Transactional
    public VehicleResponse addVehicle(VehicleRequest request) {
        Vehicle vehicle = Vehicle.builder()
            .make(request.make())
            .model(request.model())
            .category(request.category())
            .price(request.price())
            .quantityInStock(request.quantityInStock())
            .build();

        Vehicle saved = vehicleRepository.save(vehicle);

        return new VehicleResponse(
            saved.getId(),
            saved.getMake(),
            saved.getModel(),
            saved.getCategory(),
            saved.getPrice(),
            saved.getQuantityInStock()
        );
    }
}