-- schema initialization

CREATE TYPE category_type AS ENUM ('EXPENSE', 'INCOME');

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL
);

CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    type category_type NOT NULL,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE payment_methods (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE incomes (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    category_id BIGINT REFERENCES categories(id),
    amount NUMERIC(10,2) NOT NULL,
    occurred_date DATE NOT NULL,
    payment_method_id BIGINT REFERENCES payment_methods(id)
);

CREATE TABLE expenses (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    category_id BIGINT REFERENCES categories(id),
    amount NUMERIC(10,2) NOT NULL,
    occurred_date DATE NOT NULL,
    payment_method_id BIGINT REFERENCES payment_methods(id)
);

-- seed data
INSERT INTO users (id, username) VALUES (1, 'demo');

INSERT INTO categories (type, name) VALUES
  ('EXPENSE', '食費'),
  ('EXPENSE', '住居'),
  ('EXPENSE', '水道光熱'),
  ('EXPENSE', '教育'),
  ('EXPENSE', '医療'),
  ('EXPENSE', '税金'),
  ('EXPENSE', '保険'),
  ('EXPENSE', '投資'),
  ('INCOME', '給与'),
  ('INCOME', '事業'),
  ('INCOME', '配当');

INSERT INTO payment_methods (name) VALUES
  ('現金'),
  ('銀行'),
  ('クレカ'),
  ('電子決済');
