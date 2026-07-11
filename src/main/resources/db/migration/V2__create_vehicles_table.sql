-- V2: Create vehicles table

CREATE TABLE vehicles (
    id                UUID           PRIMARY KEY,
    make              VARCHAR(100)   NOT NULL,
    model             VARCHAR(100)   NOT NULL,
    category          VARCHAR(20)    NOT NULL,
    price             NUMERIC(12, 2) NOT NULL,
    quantity_in_stock INTEGER        NOT NULL DEFAULT 0,
    created_at        TIMESTAMP      NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMP      NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_category   CHECK (category IN ('SUV', 'SEDAN', 'TRUCK', 'EV', 'HATCHBACK')),
    CONSTRAINT chk_price      CHECK (price > 0),
    CONSTRAINT chk_quantity   CHECK (quantity_in_stock >= 0)
);
