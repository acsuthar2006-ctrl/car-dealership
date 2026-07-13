package com.incubyte.dealership.purchase.controller;

import com.incubyte.dealership.auth.entity.User;
import com.incubyte.dealership.purchase.dto.PurchaseResponse;
import com.incubyte.dealership.purchase.service.PurchaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/purchases")
@RequiredArgsConstructor
public class PurchaseController {

	private final PurchaseService purchaseService;

	@GetMapping
	public ResponseEntity<List<PurchaseResponse>> getPurchases(
			@AuthenticationPrincipal User user) {
		UUID userId = user.getId();
		return ResponseEntity.ok(purchaseService.getUserPurchases(userId));
	}
}
