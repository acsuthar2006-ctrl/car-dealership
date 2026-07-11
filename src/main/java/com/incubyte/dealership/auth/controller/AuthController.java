package com.incubyte.dealership.auth.controller;

import com.incubyte.dealership.auth.dto.AuthUserResponse;
import com.incubyte.dealership.auth.dto.JwtResponse;
import com.incubyte.dealership.auth.dto.LoginRequest;
import com.incubyte.dealership.auth.dto.RegisterRequest;
import com.incubyte.dealership.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
	private final AuthService authService;

	@PostMapping("/register")
	public ResponseEntity<AuthUserResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {
		log.info("Received request to register user with username: {} and email: {}", registerRequest.username(), registerRequest.email());
		return ResponseEntity
			.status(HttpStatus.CREATED)
			.body(authService.register(registerRequest));
	}

	@PostMapping("/login")
	public ResponseEntity<JwtResponse> login(@Valid @RequestBody LoginRequest request) {
		log.info("Received request to login user with username: {}", request.username());
		return ResponseEntity.ok(authService.login(request));
	}

}
