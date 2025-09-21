-- salaries, card statements and sample data

CREATE TABLE salaries (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    month DATE NOT NULL,
    total NUMERIC(19,4) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    version BIGINT NOT NULL DEFAULT 0
);

CREATE TABLE card_statements (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    card_name VARCHAR(100) NOT NULL,
    month DATE NOT NULL,
    closing_date DATE,
    payment_due_date DATE,
    status VARCHAR(20),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    version BIGINT NOT NULL DEFAULT 0
);

CREATE TABLE card_statement_items (
    id BIGSERIAL PRIMARY KEY,
    statement_id BIGINT REFERENCES card_statements(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    description VARCHAR(255) NOT NULL,
    amount NUMERIC(19,4) NOT NULL,
    flagged BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    version BIGINT NOT NULL DEFAULT 0
);

-- additional categories
INSERT INTO categories (type, name, parent_type) VALUES
  ('EXPENSE', '交通費', 'EXPENSE'),
  ('EXPENSE', '通信費', 'EXPENSE'),
  ('EXPENSE', '娯楽費', 'EXPENSE'),
  ('EXPENSE', 'その他支出', 'EXPENSE'),
  ('INCOME', '賞与', 'INCOME');

-- sample incomes
INSERT INTO incomes (user_id, category_id, amount, occurred_date, payment_method_id) VALUES
  (1, (SELECT id FROM categories WHERE name='給与'), 300000, '2025-08-25', (SELECT id FROM payment_methods WHERE name='銀行')),
  (1, (SELECT id FROM categories WHERE name='給与'), 300000, '2025-09-25', (SELECT id FROM payment_methods WHERE name='銀行'));

-- sample expenses
INSERT INTO expenses (user_id, category_id, amount, occurred_date, payment_method_id) VALUES
  (1, (SELECT id FROM categories WHERE name='食費'), 25000, '2025-08-03', (SELECT id FROM payment_methods WHERE name='現金')),
  (1, (SELECT id FROM categories WHERE name='住居'), 80000, '2025-08-01', (SELECT id FROM payment_methods WHERE name='銀行')),
  (1, (SELECT id FROM categories WHERE name='食費'), 26000, '2025-09-05', (SELECT id FROM payment_methods WHERE name='現金'));

-- sample salaries
INSERT INTO salaries (user_id, month, total) VALUES
  (1, '2025-08-01', 300000),
  (1, '2025-09-01', 300000);

-- sample fixed cost
INSERT INTO fixed_costs (household_id, name, amount, start_date, end_date, category_id, created_at, updated_at, created_by, updated_by, version)
VALUES
  (1, 'Rent', 80000, '2024-01-01', NULL, (SELECT id FROM categories WHERE name='住居'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'system', 'system', 0);

-- sample card statement and items
INSERT INTO card_statements (user_id, card_name, month, closing_date, payment_due_date, status)
VALUES
  (1, 'Rakuten', '2025-08-01', '2025-08-25', '2025-09-10', 'confirmed');

INSERT INTO card_statement_items (statement_id, date, description, amount)
VALUES
  ((SELECT id FROM card_statements WHERE card_name='Rakuten' AND month='2025-08-01'), '2025-08-05', 'Grocery', 5000),
  ((SELECT id FROM card_statements WHERE card_name='Rakuten' AND month='2025-08-01'), '2025-08-15', 'Gasoline', 4000);
