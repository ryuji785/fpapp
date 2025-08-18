-- accounts, cards, transactions and seed data

CREATE TABLE accounts (
    id BIGSERIAL PRIMARY KEY,
    household_id BIGINT REFERENCES households(id),
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    version BIGINT NOT NULL DEFAULT 0
);

CREATE TABLE cards (
    id BIGSERIAL PRIMARY KEY,
    household_id BIGINT REFERENCES households(id),
    name VARCHAR(100) NOT NULL,
    limit_amount NUMERIC(19,4),
    closing_day INT,
    payment_due_day INT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    version BIGINT NOT NULL DEFAULT 0
);

CREATE TYPE transaction_type AS ENUM ('INCOME', 'EXPENSE', 'SAVINGS');
ALTER TYPE category_type ADD VALUE IF NOT EXISTS 'SAVINGS';

ALTER TABLE categories ADD COLUMN IF NOT EXISTS parent_type category_type;
UPDATE categories SET parent_type = type WHERE parent_type IS NULL;

CREATE TABLE transactions (
    id BIGSERIAL PRIMARY KEY,
    household_id BIGINT REFERENCES households(id),
    user_id BIGINT REFERENCES users(id),
    type transaction_type NOT NULL,
    category_id BIGINT REFERENCES categories(id),
    amount NUMERIC(19,4) NOT NULL,
    occurred_date DATE NOT NULL,
    payment_method_id BIGINT REFERENCES payment_methods(id),
    card_id BIGINT REFERENCES cards(id),
    emoney_type VARCHAR(50),
    account_id BIGINT REFERENCES accounts(id),
    from_account_id BIGINT REFERENCES accounts(id),
    to_account_id BIGINT REFERENCES accounts(id),
    memo TEXT,
    receipt_path VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    version BIGINT NOT NULL DEFAULT 0
);

INSERT INTO payment_methods (name) VALUES
  ('cash'),
  ('bank transfer'),
  ('credit card'),
  ('debit card'),
  ('e-money'),
  ('direct debit'),
  ('Rakuten'),
  ('Aeon'),
  ('Amazon Mastercard'),
  ('JCB'),
  ('Mitsui Sumitomo'),
  ('other card'),
  ('Suica'),
  ('PASMO'),
  ('nanaco'),
  ('WAON'),
  ('PayPay'),
  ('LINE Pay'),
  ('other e-money');

INSERT INTO categories (type, name, parent_type) VALUES
  ('SAVINGS', '貯蓄', 'SAVINGS');
