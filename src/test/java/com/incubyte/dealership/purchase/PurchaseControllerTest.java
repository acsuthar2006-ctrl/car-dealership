package com.incubyte.dealership.purchase;

import com.incubyte.dealership.auth.entity.Role;
import com.incubyte.dealership.auth.entity.User;
import com.incubyte.dealership.auth.service.AuthService;
import com.incubyte.dealership.purchase.controller.PurchaseController;
import com.incubyte.dealership.purchase.dto.PurchaseResponse;
import com.incubyte.dealership.purchase.entity.Status;
import com.incubyte.dealership.purchase.service.PurchaseService;
import com.incubyte.dealership.shared.security.CustomUserDetailsService;
import com.incubyte.dealership.shared.security.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = PurchaseController.class)
public class PurchaseControllerTest {

	@Autowired
	private MockMvc mockMvc;

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
		UUID purchaseId = UUID.randomUUID();
		UUID userId = UUID.randomUUID();
		User mockUser = new User();
		mockUser.setId(userId);
		mockUser.setUsername("aarya");
		mockUser.setRole(Role.USER);

		PurchaseResponse response = new PurchaseResponse(
				purchaseId,
				"Tesla",
				"Model 3",
				"EV",
				45000.00,
				LocalDateTime.now(),
				Status.COMPLETED);

		when(purchaseService.getUserPurchases(userId))
				.thenReturn(List.of(response));

		// Act & Assert
		mockMvc.perform(get("/purchases")
				.with(SecurityMockMvcRequestPostProcessors.user(mockUser)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[0].id").value(purchaseId.toString()))
				.andExpect(jsonPath("$[0].vehicleMake").value("Tesla"))
				.andExpect(jsonPath("$[0].vehicleModel").value("Model 3"))
				.andExpect(jsonPath("$[0].status").value("COMPLETED"));
	}

	@Test
	public void testGetUserPurchases_Unauthorized() throws Exception {
		// Act & Assert
		mockMvc.perform(get("/purchases"))
				.andExpect(status().isUnauthorized());
	}
}