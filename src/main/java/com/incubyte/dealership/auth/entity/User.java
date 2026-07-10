package com.incubyte.dealership.auth.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
	@Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

	@Column(nullable = false, unique = true)
	private String username;

	@Column(nullable = false , unique = true)
	private String email;

	@Column(nullable = false)
	private String password;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Role role =  Role.USER;

	@CreationTimestamp
	private LocalDateTime createdAt;
}
