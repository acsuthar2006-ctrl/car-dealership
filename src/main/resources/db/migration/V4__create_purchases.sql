-- V3: Create purchases table

CREATE TABLE purchases (
    id              UUID PRIMARY KEY,
    user_id         UUID NOT NULL REFERENCES users(id),
    vehicle_id      UUID NOT NULL REFERENCES vehicles(id),
    -- Purchase metadata
    purchase_date   TIMESTAMP NOT NULL DEFAULT NOW(),
    status          VARCHAR(50) NOT NULL DEFAULT 'COMPLETED',

    CONSTRAINT chk_status CHECK (status = 'COMPLETED')
); 