package com.incubyte.dealership.vehicle.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import com.incubyte.dealership.vehicle.dto.VehicleRequest;
import com.incubyte.dealership.vehicle.dto.VehicleResponse;
import com.incubyte.dealership.vehicle.service.VehicleService;
import com.incubyte.dealership.shared.security.JwtService;
import com.incubyte.dealership.shared.security.CustomUserDetailsService;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(value = VehicleController.class, excludeAutoConfiguration = SecurityAutoConfiguration.class)
class VehicleControllerTest {

	private static final String VEHICLES_ENDPOINT = "/vehicles";

	@Autowired
	MockMvc mockMvc;

	@Autowired
	ObjectMapper objectMapper;

	@MockitoBean
	VehicleService vehicleService;

	@MockitoBean
	JwtService jwtService;

	@MockitoBean
	CustomUserDetailsService customUserDetailsService;

	@Test
	void addVehicle_withValidPayload_returns201Created() throws Exception {
		// ARRANGE
		var request = new VehicleRequest("Toyota", "Camry", "SEDAN", 25000.00, 5);
		UUID vehicleId = UUID.randomUUID();
		var response = new VehicleResponse(vehicleId, "Toyota", "Camry", "SEDAN", 25000.00, 5);

		when(vehicleService.addVehicle(any())).thenReturn(response);

		// ACT + ASSERT
		mockMvc.perform(post(VEHICLES_ENDPOINT)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
			.andExpect(status().isCreated())
			.andExpect(jsonPath("$.id").exists())
			.andExpect(jsonPath("$.make").value("Toyota"))
			.andExpect(jsonPath("$.model").value("Camry"))
			.andExpect(jsonPath("$.category").value("SEDAN"));
	}

	@Test
	void addVehicle_withNegativePrice_returns400BadRequest() throws Exception {
		// ARRANGE
		var request = new VehicleRequest("Toyota", "Camry", "SEDAN", -10000.0, 5);

		// ACT + ASSERT
		mockMvc.perform(post(VEHICLES_ENDPOINT)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
			.andExpect(status().isBadRequest());
	}

	@Test
	void addVehicle_withBlankStrings_returns400BadRequest() throws Exception {
		// ARRANGE
		var request = new VehicleRequest("", "", "", 25000.0, 5);

		// ACT + ASSERT
		mockMvc.perform(post(VEHICLES_ENDPOINT)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
			.andExpect(status().isBadRequest());
	}
}