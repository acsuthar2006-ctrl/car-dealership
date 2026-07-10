package com.incubyte.dealership.shared.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {

	// Injected from application.properties → app.jwt.secret
	@Value("${app.jwt.secret}")
	private String secret;

	// Injected from application.properties → app.jwt.expiration-ms
	@Value("${app.jwt.expiration-ms}")
	private long expirationMs;

	public String generateToken(String username) {
		return Jwts.builder()
			.subject(username)
			.issuedAt(new Date())
			.expiration(new Date(System.currentTimeMillis() + expirationMs))
			.signWith(getSigningKey())
			.compact();
	}

	private SecretKey getSigningKey() {
		return Keys.hmacShaKeyFor(secret.getBytes());
	}
}
