package com.incubyte.dealership.auth.service;

import com.incubyte.dealership.auth.dto.AuthUserResponse;
import com.incubyte.dealership.auth.dto.JwtResponse;
import com.incubyte.dealership.auth.dto.LoginRequest;
import com.incubyte.dealership.auth.dto.RegisterRequest;
import com.incubyte.dealership.auth.entity.User;
import com.incubyte.dealership.auth.repository.UserRepository;
import com.incubyte.dealership.shared.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)        // ← class-level default (reads)
public class AuthService {

	private final PasswordEncoder passwordEncoder;
	private final UserRepository userRepository;
	private final JwtService jwtService;

	@Transactional                     // ← override for writes
	public AuthUserResponse register(RegisterRequest registerRequest) {
		User user = User.builder()
			.username(registerRequest.username())
			.email(registerRequest.email())
			.password(passwordEncoder.encode(registerRequest.password()))
			.build();

		userRepository.save(user);

		return new AuthUserResponse(user.getId() , user.getUsername(), user.getEmail());
	}

	public JwtResponse login(LoginRequest request) {
		User user = userRepository.findByUsername(request.username())
			.orElseThrow(() -> new RuntimeException("Invalid credentials"));

		if (!passwordEncoder.matches(request.password(), user.getPassword())) {
			throw new RuntimeException("Invalid credentials");
		}

		String token = jwtService.generateToken(user.getUsername());
		return new JwtResponse(token);
	}

}
