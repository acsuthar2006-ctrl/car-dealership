package com.incubyte.dealership.vehicle.repository;

import com.incubyte.dealership.vehicle.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, UUID> {
    boolean existsByMakeIgnoreCaseAndModelIgnoreCase(String make, String model);
}
