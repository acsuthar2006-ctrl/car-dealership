package com.incubyte.dealership.vehicle.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
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
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import com.incubyte.dealership.shared.config.SecurityConfig;
import com.incubyte.dealership.shared.security.JwtFilterChain;

@WebMvcTest(VehicleController.class)
@Import({ SecurityConfig.class, JwtFilterChain.class })
@WithMockUser
class VehicleControllerTest {

	private static final String VEHICLES_ENDPOINT = "/vehicles";
	private static final String SEARCH_ENDPOINT = "/vehicles/search";

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
		var request = new VehicleRequest("Toyota", "Camry", "SEDAN", 25000.00);
		UUID vehicleId = UUID.randomUUID();
		var response = new VehicleResponse(vehicleId, "Toyota", "Camry", "SEDAN", 25000.00, 1);

		when(vehicleService.addVehicle(any())).thenReturn(response);

		// ACT + ASSERT
		mockMvc.perform(post(VEHICLES_ENDPOINT)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.id").exists())
				.andExpect(jsonPath("$.make").value("Toyota"))
				.andExpect(jsonPath("$.model").value("Camry"))
				.andExpect(jsonPath("$.category").value("SEDAN"))
				.andExpect(jsonPath("$.quantityInStock").value(1));
	}

	@Test
	void addVehicle_withDuplicateMakeAndModel_returns409Conflict() throws Exception {
		// ARRANGE
		var request = new VehicleRequest("Toyota", "Camry", "SEDAN", 25000.00);

		when(vehicleService.addVehicle(any())).thenThrow(
				new com.incubyte.dealership.vehicle.exception.VehicleAlreadyExistsException("Toyota", "Camry"));

		// ACT + ASSERT
		mockMvc.perform(post(VEHICLES_ENDPOINT)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isConflict())
				.andExpect(jsonPath("$.error").exists());
	}

	@Test
	void addVehicle_withNegativePrice_returns400BadRequest() throws Exception {
		// ARRANGE
		var request = new VehicleRequest("Toyota", "Camry", "SEDAN", -10000.0);

		// ACT + ASSERT
		mockMvc.perform(post(VEHICLES_ENDPOINT)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isBadRequest());
	}

	@Test
	void addVehicle_withBlankStrings_returns400BadRequest() throws Exception {
		// ARRANGE
		var request = new VehicleRequest("", "", "", 25000.0);

		// ACT + ASSERT
		mockMvc.perform(post(VEHICLES_ENDPOINT)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isBadRequest());
	}

	@Test
	@WithMockUser
	void getVehicles_returns200AndListOfVehicles() throws Exception {
		// ARRANGE
		var response = new VehicleResponse(UUID.randomUUID(), "Ford", "Mustang", "COUPE", 45000.0, 2);
		when(vehicleService.getVehicles()).thenReturn(java.util.List.of(response));

		// ACT + ASSERT
		mockMvc.perform(get(VEHICLES_ENDPOINT))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.size()").value(1))
				.andExpect(jsonPath("$[0].make").value("Ford"));
	}

	@Test
	@WithMockUser
	void searchVehicles_withCriteria_returnsMatchingVehicles() throws Exception {
		// ARRANGE
		var response = new VehicleResponse(UUID.randomUUID(), "Honda", "Civic", "SEDAN", 20000.0, 5);
		when(vehicleService.searchVehicles("Honda", "Civic", "SEDAN", 15000.0, 25000.0))
				.thenReturn(java.util.List.of(response));

		// ACT + ASSERT
		mockMvc.perform(get(VEHICLES_ENDPOINT + "/search")
				.param("make", "Honda")
				.param("model", "Civic")
				.param("category", "SEDAN")
				.param("minPrice", "15000.0")
				.param("maxPrice", "25000.0"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.size()").value(1))
				.andExpect(jsonPath("$[0].make").value("Honda"));
	}

	@Test
	@WithMockUser
	void searchVehicles_byMake_returns200AndFilteredResults() throws Exception {
		var response = new VehicleResponse(UUID.randomUUID(), "Toyota", "Camry", "SEDAN", 25000.0, 5);
		when(vehicleService.searchVehicles("Toyota", null, null, null, null))
				.thenReturn(java.util.List.of(response));

		mockMvc.perform(get(SEARCH_ENDPOINT + "?make=Toyota"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.size()").value(1))
				.andExpect(jsonPath("$[0].make").value("Toyota"));
	}

	@Test
	@WithMockUser
	void searchVehicles_byPriceRange_returns200AndFilteredResults() throws Exception {
		var response = new VehicleResponse(UUID.randomUUID(), "Honda", "Civic", "SEDAN", 23000.0, 8);
		when(vehicleService.searchVehicles(null, null, null, 20000.0, 30000.0))
				.thenReturn(java.util.List.of(response));

		mockMvc.perform(get(SEARCH_ENDPOINT + "?minPrice=20000&maxPrice=30000"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.size()").value(1));
	}

	@Test
	@WithMockUser
	void searchVehicles_withNoMatches_returns200AndEmptyList() throws Exception {
		when(vehicleService.searchVehicles("NonExistent", null, null, null, null))
				.thenReturn(java.util.List.of());

		mockMvc.perform(get(SEARCH_ENDPOINT + "?make=NonExistent"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.size()").value(0));
	}

	private static final String PURCHASE_ENDPOINT = "/vehicles";

	@Test
	@WithMockUser
	void purchaseVehicle_withAvailableStock_returns200AndDecreasesQuantity() throws Exception {
		// ARRANGE
		UUID vehicleId = UUID.randomUUID();
		var response = new VehicleResponse(vehicleId, "Toyota", "Camry", "SEDAN", 25000.00, 4);

		when(vehicleService.purchaseVehicle(vehicleId)).thenReturn(response);

		// ACT + ASSERT
		mockMvc.perform(post(PURCHASE_ENDPOINT + "/" + vehicleId + "/purchase"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.quantityInStock").value(4)); // Decreased from 5 to 4
	}

	@Test
	@WithMockUser
	void updateVehicle_withValidPayload_returns200Ok() throws Exception {
		// ARRANGE
		UUID id = UUID.randomUUID();
		var request = new VehicleRequest("Honda", "Accord", "SEDAN", 27000.00);
		var response = new VehicleResponse(id, "Honda", "Accord", "SEDAN", 27000.00, 10);

		when(vehicleService.updateVehicle(id, request)).thenReturn(response);

		// ACT + ASSERT
		mockMvc.perform(
				org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put(VEHICLES_ENDPOINT + "/" + id)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.make").value("Honda"));
	}

	@Test
	@WithMockUser
	void updateVehicle_withNonExistentId_returns404NotFound() throws Exception {
		// ARRANGE
		UUID nonExistentId = UUID.randomUUID();
		var request = new VehicleRequest("Honda", "Accord", "SEDAN", 27000.00);

		when(vehicleService.updateVehicle(nonExistentId, request))
				.thenThrow(new com.incubyte.dealership.vehicle.exception.VehicleNotFoundException(nonExistentId));

		// ACT + ASSERT
		mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders
				.put(VEHICLES_ENDPOINT + "/" + nonExistentId)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isNotFound());
	}

	@Test
	@WithMockUser(roles = "ADMIN")
	void deleteVehicle_asAdmin_returns204NoContent() throws Exception {
		// ARRANGE
		UUID id = UUID.randomUUID();
		doNothing().when(vehicleService).deleteVehicle(id);

		// ACT + ASSERT
		mockMvc.perform(delete(VEHICLES_ENDPOINT + "/" + id))
				.andExpect(status().isNoContent());
	}

	@Test
	@WithMockUser(roles = "USER")
	void deleteVehicle_asNonAdmin_returns403Forbidden() throws Exception {
		// ARRANGE
		UUID id = UUID.randomUUID();

		// ACT + ASSERT
		mockMvc.perform(delete(VEHICLES_ENDPOINT + "/" + id))
				.andExpect(status().isForbidden());
	}
}