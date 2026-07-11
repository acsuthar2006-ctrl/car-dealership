package com.incubyte.dealership.vehicle.repository;

import com.incubyte.dealership.vehicle.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, UUID>, JpaSpecificationExecutor<Vehicle> {
    boolean existsByMakeIgnoreCaseAndModelIgnoreCase(String make, String model);
}
