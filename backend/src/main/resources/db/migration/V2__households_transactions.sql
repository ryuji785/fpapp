-- schema extension for households and transactions

-- new enum for transaction types
CREATE TYPE transaction_type AS ENUM ('INCOME', 'EXPENSE', 'SAVINGS');

-- extend category_type enum to support savings
ALTER TYPE category_type ADD VALUE IF NOT EXISTS 'SAVINGS';

-- households table
CREATE TABLE households (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    notes TEXT
);

-- family members table
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
    memo TEXT
);

-- accounts table
CREATE TABLE accounts (
    id BIGSERIAL PRIMARY KEY,
    household_id BIGINT REFERENCES households(id),
    name VARCHAR(100) NOT NULL
);

-- cards table
CREATE TABLE cards (
    id BIGSERIAL PRIMARY KEY,
    household_id BIGINT REFERENCES households(id),
    name VARCHAR(100) NOT NULL,
    limit_amount NUMERIC(10,2),
    closing_day INT,
    payment_due_day INT
);

-- add parent_type column to categories
ALTER TABLE categories ADD COLUMN IF NOT EXISTS parent_type category_type;
UPDATE categories SET parent_type = type WHERE parent_type IS NULL;

-- transactions table
CREATE TABLE transactions (
    id BIGSERIAL PRIMARY KEY,
    household_id BIGINT REFERENCES households(id),
    user_id BIGINT REFERENCES users(id),
    type transaction_type NOT NULL,
    category_id BIGINT REFERENCES categories(id),
    amount NUMERIC(10,2) NOT NULL,
    occurred_date DATE NOT NULL,
    payment_method_id BIGINT REFERENCES payment_methods(id),
    card_id BIGINT REFERENCES cards(id),
    emoney_type VARCHAR(50),
    account_id BIGINT REFERENCES accounts(id),
    from_account_id BIGINT REFERENCES accounts(id),
    to_account_id BIGINT REFERENCES accounts(id),
    memo TEXT,
    receipt_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- seed demo household
INSERT INTO households (id, name, notes) VALUES (1, 'Demo Household', NULL);

-- extend payment methods
INSERT INTO payment_methods (name) VALUES
  ('cash'),
  ('bank transfer'),
  ('credit card'),
  ('debit card'),
  ('e-money'),
  ('direct debit');

-- seed savings category
INSERT INTO categories (type, name, parent_type) VALUES
  ('SAVINGS', '貯蓄', 'SAVINGS');
