package com.incubyte.dealership.inventory.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import com.incubyte.dealership.inventory.dto.VehicleRequest;
import com.incubyte.dealership.inventory.dto.VehicleResponse;
import com.incubyte.dealership.inventory.service.VehicleService;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(VehicleController.class)
class VehicleControllerTest {

	@Autowired
	MockMvc mockMvc;

	@Autowired
	ObjectMapper objectMapper;

	@MockitoBean
	VehicleService vehicleService;

	@Test
	void addVehicle_withValidPayload_returns201Created() throws Exception {
		// ARRANGE
		var request = new VehicleRequest("Toyota", "Camry", "SEDAN", 25000.00, 5);
		var response = new VehicleResponse(1L, "Toyota", "Camry", "SEDAN", 25000.00, 5);

		when(vehicleService.addVehicle(any())).thenReturn(response);

		// ACT + ASSERT
		mockMvc.perform(post("/auth/vehicles")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
			.andExpect(status().isCreated())   // 201
			.andExpect(jsonPath("$.id").exists())
			.andExpect(jsonPath("$.brand").value("Toyota"))
			.andExpect(jsonPath("$.model").value("Camry"))
			.andExpect(jsonPath("$.type").value("SEDAN"));
	}
}