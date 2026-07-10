package com.incubyte.dealership.auth.service;

import com.incubyte.dealership.auth.dto.AuthUserResponse;
import com.incubyte.dealership.auth.dto.RegisterRequest;
import com.incubyte.dealership.auth.entity.User;
import com.incubyte.dealership.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

	private final PasswordEncoder passwordEncoder;
	private final UserRepository userRepository;

	public AuthUserResponse register(RegisterRequest registerRequest) {
		User user = User.builder()
			.username(registerRequest.username())
			.email(registerRequest.email())
			.password(passwordEncoder.encode(registerRequest.password()))
			.build();

		userRepository.save(user);

		return new AuthUserResponse(user.getId() , user.getUsername(), user.getEmail());
	}
}
