package com.incubyte.dealership.purchase;

import com.incubyte.dealership.auth.repository.UserRepository;
import com.incubyte.dealership.auth.entity.User;
import com.incubyte.dealership.vehicle.entity.Vehicle;
import com.incubyte.dealership.vehicle.repository.VehicleRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PurchaseServiceTest {

	@Mock
	private PurchaseRepository purchaseRepository;

	@Mock
	private UserRepository userRepository;

	@Mock
	private VehicleRepository vehicleRepository;

	@InjectMocks
	private PurchaseService purchaseService;

	@Test
	public void testPurchaseVehicle_Success() {
		// Arrange
		UUID userId = UUID.randomUUID();
		UUID vehicleId = UUID.randomUUID();

		User user = new User();
		user.setId(userId);

		Vehicle vehicle = new Vehicle();
		vehicle.setId(vehicleId);
		vehicle.setMake("Tesla");
		vehicle.setModel("Model 3");
		vehicle.setQuantityInStock(5);

		when(userRepository.findById(userId)).thenReturn(Optional.of(user));
		when(vehicleRepository.findById(vehicleId)).thenReturn(Optional.of(vehicle));

		// Act
		Purchase purchase = purchaseService.purchaseVehicle(userId, vehicleId);

		// Assert
		assertNotNull(purchase);
		assertEquals(userId, purchase.getUserId());
		assertEquals(vehicleId, purchase.getVehicleId());
		assertEquals("COMPLETED", purchase.getStatus());
		verify(vehicleRepository).save(vehicle);
		assertEquals(4, vehicle.getQuantityInStock());
	}

}