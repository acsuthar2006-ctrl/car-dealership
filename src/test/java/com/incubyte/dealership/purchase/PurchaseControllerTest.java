package com.incubyte.dealership.purchase;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.incubyte.dealership.auth.service.AuthService;
import com.incubyte.dealership.purchase.dto.PurchaseResponse;
import com.incubyte.dealership.purchase.entity.Status;
import com.incubyte.dealership.purchase.service.PurchaseService;
import com.incubyte.dealership.shared.security.CustomUserDetailsService;
import com.incubyte.dealership.shared.security.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = PurchaseController.class, excludeAutoConfiguration = SecurityAutoConfiguration.class)
public class PurchaseControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@MockitoBean
	private PurchaseService purchaseService;

	@MockitoBean
	private AuthService authService;

	@MockitoBean
	private JwtService jwtService;

	@MockitoBean
	private CustomUserDetailsService customUserDetailsService;

	@Test
	public void testGetUserPurchases_Success() throws Exception {
		// Arrange
		UUID userId = UUID.randomUUID();
		UUID purchaseId = UUID.randomUUID();

		PurchaseResponse response = new PurchaseResponse(
			purchaseId,
			"Tesla",
			"Model 3",
			"EV",
			45000.00,
			LocalDateTime.now(),
			Status.COMPLETED
		);

		when(purchaseService.getUserPurchases(userId))
			.thenReturn(List.of(response));

		// Act & Assert
		mockMvc.perform(get("/purchases")
				.header("Authorization", "Bearer valid-token"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$[0].id").value(purchaseId.toString()))
			.andExpect(jsonPath("$[0].vehicleMake").value("Tesla"))
			.andExpect(jsonPath("$[0].vehicleModel").value("Model 3"))
			.andExpect(jsonPath("$[0].status").value("COMPLETED"));
	}

	@Test
	public void testGetUserPurchases_Unauthorized() throws Exception {
		// Act & Assert
		mockMvc.perform(get("/api/v1/purchases"))
			.andExpect(status().isUnauthorized());
	}
}