-- fixed costs table
CREATE TABLE fixed_costs (
    id BIGSERIAL PRIMARY KEY,
    household_id BIGINT REFERENCES households(id),
    name VARCHAR(100) NOT NULL,
    amount NUMERIC(19,4) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    category_id BIGINT REFERENCES categories(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    version BIGINT NOT NULL DEFAULT 0
);
