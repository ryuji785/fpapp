-- households and family members tables

CREATE TABLE households (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    version BIGINT NOT NULL DEFAULT 0
);

CREATE TABLE family_members (
    id BIGSERIAL PRIMARY KEY,
    household_id BIGINT REFERENCES households(id),
    name VARCHAR(100) NOT NULL,
    relationship VARCHAR(20),
    birth_date DATE,
    gender VARCHAR(10),
    employment_status VARCHAR(30),
    school_start_age INT,
    retirement_age INT,
    memo TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    version BIGINT NOT NULL DEFAULT 0
);

-- seed demo household
INSERT INTO households (id, name, notes) VALUES (1, 'Demo Household', NULL);
