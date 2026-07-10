-- V1: Create users table
-- Role is stored as a simple VARCHAR (USER or ADMIN) for clarity

CREATE TABLE users (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username    VARCHAR(50)  NOT NULL UNIQUE,
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    role        VARCHAR(10)  NOT NULL DEFAULT 'USER',
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_role CHECK (role IN ('USER', 'ADMIN'))
);
