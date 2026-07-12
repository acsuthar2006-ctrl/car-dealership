package com.incubyte.dealership.auth.service;

import com.incubyte.dealership.auth.dto.AuthUserResponse;
import com.incubyte.dealership.auth.dto.JwtResponse;
import com.incubyte.dealership.auth.dto.LoginRequest;
import com.incubyte.dealership.auth.dto.RegisterRequest;
import com.incubyte.dealership.auth.entity.Role;
import com.incubyte.dealership.auth.entity.User;
import com.incubyte.dealership.auth.exception.InvalidCredentialsException;
import com.incubyte.dealership.auth.repository.UserRepository;
import com.incubyte.dealership.shared.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true) // ← class-level default (reads)
public class AuthService {

	private final PasswordEncoder passwordEncoder;
	private final UserRepository userRepository;
	private final JwtService jwtService;

	@Transactional // ← override for writes
	public AuthUserResponse register(RegisterRequest registerRequest) {
		log.debug("Creating new user entity for username: {}", registerRequest.username());
		User user = User.builder()
				.username(registerRequest.username())
				.email(registerRequest.email())
				.password(passwordEncoder.encode(registerRequest.password()))
				.role(Role.USER)
				.build();

		userRepository.save(user);
		log.info("Successfully registered user with id: {}", user.getId());

		return new AuthUserResponse(user.getId(), user.getUsername(), user.getEmail());
	}

	public JwtResponse login(LoginRequest request) {
		User user = userRepository.findByUsername(request.username())
				.orElseThrow(InvalidCredentialsException::new);

		if (!passwordEncoder.matches(request.password(), user.getPassword())) {
			log.warn("Invalid password attempt for username: {}", request.username());
			throw new InvalidCredentialsException();
		}

		String token = jwtService.generateToken(user);
		log.info("Successfully generated JWT token for username: {}", request.username());
		return new JwtResponse(token);
	}

}
