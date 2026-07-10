package com.incubyte.dealership.auth.dto;

import java.util.UUID;

public record AuthUserResponse(
	UUID id,
	String username,
	String email
) {
}
