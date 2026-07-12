package com.incubyte.dealership.vehicle.service;

import com.incubyte.dealership.vehicle.dto.RestockRequest;
import com.incubyte.dealership.vehicle.dto.VehicleRequest;
import com.incubyte.dealership.vehicle.dto.VehicleResponse;
import com.incubyte.dealership.vehicle.entity.Vehicle;
import com.incubyte.dealership.vehicle.exception.OutOfStockException;
import com.incubyte.dealership.vehicle.exception.VehicleAlreadyExistsException;
import com.incubyte.dealership.vehicle.exception.VehicleNotFoundException;
import com.incubyte.dealership.vehicle.repository.VehicleRepository;
import com.incubyte.dealership.vehicle.repository.VehicleSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
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
        Specification<Vehicle> spec = Specification.where(null);

        if (make != null) {
            spec = spec.and(VehicleSpecification.hasMake(make));
        }
        if (model != null) {
            spec = spec.and(VehicleSpecification.hasModel(model));
        }
        if (category != null) {
            spec = spec.and(VehicleSpecification.hasCategory(category));
        }
        if (minPrice != null) {
            spec = spec.and(VehicleSpecification.priceGreaterThanOrEqualTo(minPrice));
        }
        if (maxPrice != null) {
            spec = spec.and(VehicleSpecification.priceLessThanOrEqualTo(maxPrice));
        }

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
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new VehicleNotFoundException(id));
        if (vehicle.getQuantityInStock() <= 0) {
            throw new OutOfStockException(id);
        }
        vehicle.setQuantityInStock(vehicle.getQuantityInStock() - 1);
        Vehicle saved = vehicleRepository.save(vehicle);
        return mapToResponse(saved);
    }

    @Transactional
    public VehicleResponse restockVehicle(UUID id, RestockRequest request) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new VehicleNotFoundException(id));
        vehicle.setQuantityInStock(vehicle.getQuantityInStock() + request.quantity());
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