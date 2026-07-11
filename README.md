# Car Dealership Inventory System

A full-stack Car Dealership Inventory System built with Spring Boot, PostgreSQL, and JWT Authentication. This project is being developed using strict **Test-Driven Development (TDD)** practices and a clean layered architecture.

## 🚀 Development Methodology

This project is built using a strict **RED-GREEN-REFACTOR** TDD cycle:
1. **RED:** Write a failing test first to define the exact behavior expected.
2. **GREEN:** Write the absolute minimum production code required to make the test pass.
3. **REFACTOR:** Clean up the code without changing its behavior, relying on the passing tests as a safety net.

### Pair Programming with AI
Throughout the development of this project, I am utilizing AI as a **Senior Developer / Mentor**. 
Instead of the AI writing the entire codebase for me, we operate in a pair-programming dynamic:
* The AI guides the architectural decisions and enforces TDD strictness.
* I write the core logic and tests based on the AI's prompts and skeletons.
* We review the code together, discussing design patterns, Spring Security nuances, and edge cases.
* The AI helps troubleshoot complex integration issues (like Spring Boot context loading and Filter Chains) while explaining the *why* behind the fix.

## 🧪 Testing Strategy

We rely heavily on **Slice Testing** (specifically `@WebMvcTest`) to test our Web Layer in complete isolation from the Business and Data layers.

By using `@WebMvcTest` along with `@MockitoBean`, we achieve:
* **Speed:** Tests run in milliseconds because the full Spring application context and database are not loaded.
* **Separation of Concerns:** We test routing, JSON serialization/deserialization, and HTTP status codes without worrying about database state or business logic errors.
* **Simulated Edge Cases:** By mocking the Service layer (`when(service.doSomething()).thenThrow(...)`), we can easily test how our API responds to failure scenarios (e.g., returning `401 Unauthorized` for bad credentials).

---

## 📦 Modules Completed

### Module 1: Authentication & Security 🟢
Fully implemented a stateless JWT authentication system.

**Features:**
* `POST /auth/register`: Accepts user credentials, hashes the password using `BCryptPasswordEncoder`, and saves the user to the database. Returns `201 Created` with the user profile (excluding the password).
* `POST /auth/login`: Verifies user credentials and generates a secure JSON Web Token (JWT). Returns `200 OK` with the token.
* **Security Filter Chain:** A custom `JwtFilterChain` intercepts all incoming requests, validates the Bearer token, and extracts the user context to secure the API.

**Key Technical Decisions:**
* **jjwt 0.12.3:** Used the latest JJWT library for secure token generation and validation.
* **Stateless Sessions:** Configured Spring Security to use `SessionCreationPolicy.STATELESS` since we are relying entirely on JWTs.
* **Bypass WebMvcTest Security:** Used `@MockitoBean` for `JwtService` and `CustomUserDetailsService` in our slice tests to prevent the test context from crashing when it attempts to load the real `SecurityConfig`.
