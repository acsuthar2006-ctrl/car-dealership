package com.incubyte.dealership.purchase.dto;

import com.incubyte.dealership.purchase.entity.Status;

import java.time.LocalDateTime;
import java.util.UUID;

public record PurchaseResponse(
	UUID id,
	String vehicleMake,
	String vehicleModel,
	String vehicleCategory,
	double vehiclePrice,
	LocalDateTime purchaseDate,
	Status status
) {
}
