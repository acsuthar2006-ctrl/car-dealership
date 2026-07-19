package com.incubyte.dealership.auth;

import com.incubyte.dealership.auth.controller.AuthController;
import com.incubyte.dealership.auth.dto.JwtResponse;
import com.incubyte.dealership.auth.dto.LoginRequest;
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
class LoginControllerTest {

    private static final String LOGIN_ENDPOINT = "/auth/login";

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
    void login_withValidCredentials_returns200AndJwtToken() throws Exception {
        // JWT must be issued on successful login — authentication requirement

        // ARRANGE
        var request = new LoginRequest("aarya", "secret123");
        var response = new JwtResponse("fake.jwt.token"); // token shape, not user data

        when(authService.login(any())).thenReturn(response);

        // ACT + ASSERT
        mockMvc.perform(post(LOGIN_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk()) // 200 — synchronous auth
                .andExpect(jsonPath("$.token").exists()); // JWT issued
    }

    @Test
    void login_withInvalidCredentials_returns401() throws Exception {
        // ARRANGE
        var request = new LoginRequest("aarya", "wrongpassword");
        when(authService.login(any())).thenThrow(new org.springframework.security.authentication.BadCredentialsException("Bad credentials"));

        // ACT + ASSERT
        mockMvc.perform(post(LOGIN_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized()); // 401
    }

    @Test
    void login_withMissingFields_returns400() throws Exception {
        // ARRANGE
        var request = new LoginRequest("", "");

        // ACT + ASSERT
        mockMvc.perform(post(LOGIN_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.username").exists()); // 400
    }
}
