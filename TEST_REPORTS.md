# Test Execution Report

**Date:** July 12, 2026  
**Project:** Premium Auto Dealership  
**Command Executed:** `mvn test`

## Summary of Results

| Metric | Count |
| :--- | :--- |
| **Total Tests Run** | 29 |
| **Failures** | 0 |
| **Errors** | 0 |
| **Skipped** | 0 |
| **Status** | ✅ **SUCCESS** |

---

## Detailed Test Coverage

The 29 tests cover the following core functionalities across Authentication, Vehicle Management, and Application Context:

### 1. Authentication & User Management
* **Login Controller:**
  - Login with valid credentials returns `200 OK` and a JWT token.
  - Login with invalid credentials returns `401 Unauthorized`.
  - Login with missing fields returns `400 Bad Request`.
* **Registration Controller:**
  - Registration with valid payload returns `201 Created` and the new user details (without password).
  - Registration with a duplicate username or email returns `409 Conflict`.
  - Registration with an invalid email format returns `400 Bad Request`.

### 2. Vehicle Inventory Management
* **Creating Vehicles:**
  - Creating a vehicle with a valid payload returns `201 Created` with default `1` stock.
  - Creating a duplicate vehicle (same make and model) returns `409 Conflict`.
  - Creating a vehicle with a negative price returns `400 Bad Request`.
  - Creating a vehicle with blank strings returns `400 Bad Request`.
* **Fetching & Searching:**
  - Fetching all vehicles returns `200 OK` and a list of vehicles.
  - Searching by specific criteria (e.g., make) returns filtered results.
  - Searching by price range filters the vehicles correctly.
  - Searching with criteria that have no matches returns an empty list.
* **Updating & Managing Vehicles:**
  - Updating a vehicle with valid data returns `200 OK`.
  - Updating a non-existent vehicle returns `404 Not Found`.
  - Deleting a vehicle as an Admin returns `204 No Content`.
  - Attempting to delete a vehicle as a standard User returns `403 Forbidden`.

### 3. Purchasing & Restocking
* **Purchasing (User Role):**
  - Purchasing an in-stock vehicle successfully decreases the quantity.
  - Attempting to purchase an out-of-stock vehicle returns `409 Conflict`.
  - Attempting to purchase a non-existent vehicle returns `404 Not Found`.
* **Restocking (Admin Role):**
  - Restocking a vehicle as an Admin increases the quantity in stock.
  - Attempting to restock as a standard User returns `403 Forbidden`.
  - Restocking a non-existent vehicle returns `404 Not Found`.
  - Restocking with a negative quantity returns `400 Bad Request`.

### 4. System Validation
* **Context Load:**
  - Verifies that the Spring Boot application context and database connections load without errors.

---

## How We Identified the Test Cases

The 29 test cases were identified and developed through a comprehensive analysis of the business requirements, edge cases, and security constraints of the Premium Auto Dealership platform.

### 1. Requirement-Driven Identification (Happy Paths)
For every core feature, we identified the primary "happy path" that users and administrators would take:
* **Auth:** Can a user register? Can they log in?
* **Inventory:** Can we add a vehicle? Can we fetch the list? Can we search by make?
* **Transactions:** Can a user purchase a vehicle? Can an admin restock a vehicle?

### 2. Edge Case & Failure Mode Analysis (Unhappy Paths)
We mapped out what could go wrong during normal operation to ensure the system handles errors gracefully:
* **Invalid Data:** What if someone submits a negative price? What if the email format is invalid? What if required strings are blank?
* **Conflicts:** What if someone tries to register with an email that already exists? What if they try to add a duplicate vehicle?
* **Availability:** What happens if a user tries to purchase a vehicle that is currently out of stock? What if the vehicle ID doesn't exist?

### 3. Security & Role-Based Access Control (RBAC)
We identified tests based on the strict security boundaries between standard Users and Admins:
* **Admin Actions:** We explicitly tested that only users with the `ADMIN` role can delete vehicles or restock inventory. 
* **Authorization Failures:** We wrote tests to confirm that if a standard `USER` attempts these admin actions, they receive a `403 Forbidden` response.

### 4. Regression & Refactoring Identification
As the application evolved, new requirements were added (such as the `quantityInStock` feature). We identified existing tests that needed updates using:
* **Compilation Analysis:** When the `VehicleRequest` constructor signature changed to include `quantityInStock`, the Java compiler immediately flagged the outdated 4-parameter calls in `VehicleControllerTest.java` and `VehicleServiceTest.java`.
* **Search Tools:** We used codebase search tools to find all instances of `new VehicleRequest` across the `src/test` directory to ensure every test case was updated to match the new business logic.
