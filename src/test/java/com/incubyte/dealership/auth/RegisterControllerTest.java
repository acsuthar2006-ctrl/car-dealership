package com.incubyte.dealership.auth;

import com.incubyte.dealership.auth.controller.AuthController;
import com.incubyte.dealership.auth.dto.AuthUserResponse;
import com.incubyte.dealership.auth.dto.RegisterRequest;
import com.incubyte.dealership.auth.service.AuthService;
import com.incubyte.dealership.shared.security.CustomUserDetailsService;
import com.incubyte.dealership.shared.security.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import com.fasterxml.jackson.databind.ObjectMapper;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

// Security excluded — this slice test only validates the HTTP contract
@WebMvcTest(value = AuthController.class, excludeAutoConfiguration = SecurityAutoConfiguration.class)
class RegisterControllerTest {

	@Autowired
	MockMvc mockMvc;
	@Autowired
	ObjectMapper objectMapper;

	@MockitoBean
	AuthService authService;

	@MockitoBean
	JwtService jwtService;

	@MockitoBean
	CustomUserDetailsService customUserDetailsService;

	@Test
	void register_withValidPayload_returns201AndUserWithoutPassword() throws Exception {
		// Password must never be exposed in API responses — security requirement

		// ARRANGE
		var request = new RegisterRequest("aarya", "aarya@test.com", "secret123");
		var response = new AuthUserResponse(null, "aarya", "aarya@test.com");

		when(authService.register(any())).thenReturn(response);

		// ACT + ASSERT
		mockMvc.perform(post("/auth/register")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isCreated()) // 201
				.andExpect(jsonPath("$.password").doesNotExist()) // no password leak
				.andExpect(jsonPath("$.username").value("aarya")); // correct data
	}
}
