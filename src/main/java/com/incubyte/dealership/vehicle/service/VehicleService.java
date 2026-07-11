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

import com.incubyte.dealership.vehicle.exception.VehicleAlreadyExistsException;
import com.incubyte.dealership.vehicle.repository.VehicleSpecification;
import org.springframework.data.jpa.domain.Specification;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    @Transactional
    public VehicleResponse addVehicle(VehicleRequest request) {
        if (vehicleRepository.existsByMakeIgnoreCaseAndModelIgnoreCase(request.make(), request.model())) {
            throw new VehicleAlreadyExistsException(request.make(), request.model());
        }

        Vehicle vehicle = Vehicle.builder()
                .make(request.make())
                .model(request.model())
                .category(request.category())
                .price(request.price())
                .quantityInStock(1)
                .build();

        Vehicle saved = vehicleRepository.save(vehicle);

        return mapToResponse(saved);
    }

    public List<VehicleResponse> getVehicles() {
        return vehicleRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<VehicleResponse> searchVehicles(String make, String model, String category, Double minPrice,
            Double maxPrice) {
        Specification<Vehicle> spec = Specification
            .where(VehicleSpecification.hasMake(make))
                .and(VehicleSpecification.hasModel(model))
                .and(VehicleSpecification.hasCategory(category))
                .and(VehicleSpecification.priceGreaterThanOrEqualTo(minPrice))
                .and(VehicleSpecification.priceLessThanOrEqualTo(maxPrice));

        return vehicleRepository.findAll(spec).stream()
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

        Vehicle saved = vehicleRepository.save(vehicle);
        return mapToResponse(saved);
    }

    @Transactional
    public void deleteVehicle(UUID id) {
        vehicleRepository.deleteById(id);
    }

    @Transactional
    public VehicleResponse purchaseVehicle(UUID id) {
        Vehicle vehicle = vehicleRepository.findById(id).orElse(null);
        if (vehicle != null && vehicle.getQuantityInStock() <= 0) {
            throw new com.incubyte.dealership.vehicle.exception.OutOfStockException(id);
        }
        vehicle.setQuantityInStock(vehicle.getQuantityInStock() - 1);
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