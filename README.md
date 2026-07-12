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

---

### Module 2: Vehicle Inventory Management 🟢
Fully implemented CRUD operations, search, purchase, and restock functionality for the vehicle inventory.

**Features:**
* `POST /vehicles`: Add a new vehicle to the inventory with default stock of 1. Returns `409 Conflict` if a vehicle with the same make and model already exists.
* `GET /vehicles`: Retrieve a list of all vehicles in the inventory.
* `GET /vehicles/search`: Search vehicles with dynamic filtering by make, model, category, minPrice, and maxPrice using JPA Specifications.
* `PUT /vehicles/:id`: Update an existing vehicle's details. Returns `404 Not Found` if the vehicle doesn't exist.
* `DELETE /vehicles/:id`: Admin-only endpoint to remove a vehicle. Returns `403 Forbidden` for non-admin users.
* `POST /vehicles/:id/purchase`: Purchase a vehicle, decreasing its stock by 1. Returns `409 Conflict` if out of stock, `404 Not Found` if the vehicle doesn't exist.
* `POST /vehicles/:id/restock`: Admin-only endpoint to increase vehicle stock. Validates that quantity is positive (`400 Bad Request` for negative values). Returns `403 Forbidden` for non-admin users.

**Key Technical Decisions:**
* **JPA Specifications:** Used `JpaSpecificationExecutor` and a custom `VehicleSpecification` utility class for dynamic, composable query building instead of writing multiple repository methods.
* **Role-Based Access Control:** Leveraged `@PreAuthorize("hasRole('ADMIN')")` for admin-only endpoints (delete, restock).
* **Custom Exceptions:** Created `VehicleNotFoundException`, `VehicleAlreadyExistsException`, and `OutOfStockException` with a centralized `GlobalExceptionHandler` for consistent error responses.
* **Bean Validation:** Used `@Valid` with Jakarta validation annotations on DTOs (`VehicleRequest`, `RestockRequest`) for input validation.

---

## 🤖 AI Usage

This project leverages AI coding assistants as pair programming partners throughout the development process. I actively use **Google Antigravity** and **Claude** to accelerate both backend and frontend development.

| Module | AI Tool Used | Level of AI Involvement |
|---|---|---|
| Module 1: Auth & Security (Backend) | Google Gemini | Light — AI guided architecture and helped troubleshoot integration issues |
| Module 2: Vehicle Inventory (Backend) | Antigravity + Claude | Moderate — AI assisted with TDD flow, code generation, and refactoring while I drove the design and requirements |
| Module 3: Frontend Foundations | Antigravity + Claude | Heavy — AI built out the initial React application structure, connected to backend APIs, and implemented routing |
| Module 4: Luxury UI & Interactive Auth | Antigravity | Heavy — AI implemented a complete CSS overhaul to a "Luxury Auto Dealership" theme and built a complex sliding two-panel interactive authentication page |

**How AI was used across the stack:**
* **Backend:** I provided the test cases, requirements, and TDD rhythm; the AI (Antigravity/Claude) helped implement the controllers, services, and repositories following the RED-GREEN-REFACTOR cycle. The AI also assisted in updating test cases when DTO signatures changed.
* **Frontend:** I provided strict design requirements (color palettes, border-radii, animations) and UX flows; Antigravity implemented the React components, CSS stylesheets, and smooth interactive animations (like the sliding Auth Page).
* **Architecture & Debugging:** I made the core design decisions (duplicate detection, stock defaults, role-based access), while the AI served as a senior pair programmer to debug issues like CSS clipping, database constraint violations, and Spring Security configuration.
* **Review Process:** I reviewed, approved, and guided every commit — the AI executed my implementation plans only after explicit approval.

---

## 🐛 Mistakes & Learnings

### 1. Vehicle Duplication Confusion
When adding vehicles, I initially didn't account for duplicate entries. When two vehicles with the same make and model were added, it just created duplicates in the database. I was confused about what should define a "duplicate" — should it be based on make only? Model only? Both? After discussing, I decided that **make + model** together should be unique, and implemented `existsByMakeIgnoreCaseAndModelIgnoreCase()` in the repository with a custom `VehicleAlreadyExistsException`.

**Learning:** Always define your uniqueness constraints upfront before writing code. Business rules around duplicates should be decided early.

### 2. Spring Security `ROLE_` Prefix Gotcha
The `@PreAuthorize("hasRole('ADMIN')")` annotation wasn't working — admin users were getting `403 Forbidden`. Turns out Spring Security automatically prepends `ROLE_` to role names when using `hasRole()`. So the database needed to store `ROLE_ADMIN`, not just `ADMIN`. This took a while to debug.

**Learning:** Spring Security's `hasRole()` adds the `ROLE_` prefix internally. Either store roles with the prefix or use `hasAuthority()` instead.

### 3. Search Parameter Design Indecision
For the `/vehicles/search` endpoint, I kept going back and forth on whether the `make` parameter should be required or optional. First I made it required, then realized price-range-only searches wouldn't work, so I switched all params to `required = false`. This led to multiple amend commits.

**Learning:** Think through all the use cases of an endpoint before implementing. A search endpoint should almost always have optional parameters to allow flexible querying.

### 4. Understanding the TDD Rhythm
Initially, I found it awkward to intentionally write code that fails. The idea of committing broken code (RED state) felt wrong. But over time, I realized the RED commit is proof that the test actually validates something — if it passes without implementation, the test is useless.

**Learning:** The RED step is the most important step in TDD. It proves your test has value.

### 5. The "Username already exists" Masking Bug
When attempting to add a vehicle from the Admin Dashboard, the backend rejected the request but returned the error message: `"Username or email already exists"`.
This happened because the `vehicles` table had a strict Flyway check constraint on the `category` column (requiring it to be SUV, SEDAN, TRUCK, EV, or HATCHBACK). When testing with an invalid category ("TempCat"), the database rejected it with a `DataIntegrityViolationException`. However, the `GlobalExceptionHandler` was lazily configured to catch *any* `DataIntegrityViolationException` and blindly return a hardcoded "Username or email already exists" response.

**Learning:** Never blindly catch generic database exceptions like `DataIntegrityViolationException` without inspecting the root cause or specific constraint name. A single generic error message can completely mask the real issue, making debugging unnecessarily difficult. Always enforce the same constraints in the frontend UI (like using dropdowns instead of text inputs) to prevent the error in the first place.
