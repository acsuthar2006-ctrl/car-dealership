package com.incubyte.dealership.vehicle.service;

import com.incubyte.dealership.vehicle.dto.VehicleRequest;
import com.incubyte.dealership.vehicle.dto.VehicleResponse;
import com.incubyte.dealership.vehicle.entity.Vehicle;
import com.incubyte.dealership.vehicle.exception.VehicleNotFoundException;
import com.incubyte.dealership.vehicle.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

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

        return mapToResponse(saved);
    }

    public List<VehicleResponse> getVehicles() {
        return vehicleRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public VehicleResponse updateVehicle(UUID id, VehicleRequest request) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new VehicleNotFoundException(id));

        vehicle.setMake(request.make());
        vehicle.setModel(request.model());
        vehicle.setCategory(request.category());
        vehicle.setPrice(request.price());
        vehicle.setQuantityInStock(request.quantityInStock());

        Vehicle saved = vehicleRepository.save(vehicle);
        return mapToResponse(saved);
    }

    private VehicleResponse mapToResponse(Vehicle vehicle) {
        return new VehicleResponse(
                vehicle.getId(),
                vehicle.getMake(),
                vehicle.getModel(),
                vehicle.getCategory(),
                vehicle.getPrice(),
                vehicle.getQuantityInStock());
    }
}