-- V3: Seed admin user
-- Password = "admin123" hashed with BCrypt (cost 10)
-- Change this password immediately in any real deployment!

INSERT INTO users (id, username, email, password, role)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'admin',
    'admin@dealership.com',
    '$2a$10$r3LOd80VTe3Shh88a2JAIueAFnrMYzvlYZ4MU1ABl4lb2FebQkEmK',
    'ADMIN'
);
