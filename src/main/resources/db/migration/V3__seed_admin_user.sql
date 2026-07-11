-- V3: Seed admin user
-- Password = "admin123" hashed with BCrypt (cost 10)
-- Change this password immediately in any real deployment!

INSERT INTO users (id, username, email, password, role)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'admin',
    'admin@dealership.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'ADMIN'
);
