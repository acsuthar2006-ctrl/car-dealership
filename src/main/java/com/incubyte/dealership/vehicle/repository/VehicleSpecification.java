package com.incubyte.dealership.vehicle.repository;

import com.incubyte.dealership.vehicle.entity.Vehicle;
import org.springframework.data.jpa.domain.Specification;

public class VehicleSpecification {

    private VehicleSpecification() {
        // Utility class
    }

    public static Specification<Vehicle> hasMake(String make) {
        return (root, query, cb) -> cb.equal(cb.lower(root.get("make")), make.toLowerCase());
    }

    public static Specification<Vehicle> hasModel(String model) {
        return (root, query, cb) -> cb.equal(cb.lower(root.get("model")), model.toLowerCase());
    }

    public static Specification<Vehicle> hasCategory(String category) {
        return (root, query, cb) -> cb.equal(cb.lower(root.get("category")), category.toLowerCase());
    }

    public static Specification<Vehicle> priceGreaterThanOrEqualTo(Double minPrice) {
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("price"), minPrice);
    }

    public static Specification<Vehicle> priceLessThanOrEqualTo(Double maxPrice) {
        return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("price"), maxPrice);
    }
}
