package com.incubyte.dealership.purchase.service;

import com.incubyte.dealership.auth.entity.User;
import com.incubyte.dealership.auth.repository.UserRepository;
import com.incubyte.dealership.purchase.entity.Purchase;
import com.incubyte.dealership.purchase.entity.Status;
import com.incubyte.dealership.purchase.repository.PurchaseRepository;
import com.incubyte.dealership.vehicle.entity.Vehicle;
import com.incubyte.dealership.vehicle.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class PurchaseService {

	private final PurchaseRepository purchaseRepository;
	private final UserRepository userRepository;
	private final VehicleRepository vehicleRepository;

	public Purchase purchaseVehicle(UUID userId, UUID vehicleId) {
		User user = userRepository.findById(userId)
			.orElseThrow(() -> new RuntimeException("User not found"));

		Vehicle vehicle = vehicleRepository.findById(vehicleId)
			.orElseThrow(() -> new RuntimeException("Vehicle not found"));

		if (vehicle.getQuantityInStock() <= 0) {
			throw new RuntimeException("Vehicle out of stock");
		}

		vehicle.setQuantityInStock(vehicle.getQuantityInStock() - 1);
		vehicleRepository.save(vehicle);

		Purchase purchase = Purchase.builder()
			.user(user)
			.vehicle(vehicle)
			.status(Status.COMPLETED)
			.build();

		return purchaseRepository.save(purchase);
	}
}