-- 家計ユニット（例: 夫婦、個人など）
CREATE TABLE household_unit (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- ユーザー（アプリの利用者）
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    household_unit_id INT REFERENCES household_unit(id),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    salary_amount NUMERIC(10, 2),
    salary_day INT NOT NULL,
    income_growth_rate NUMERIC(5, 2), -- 昇給率(%)
    income_max_age INT               -- 到達年齢
);

-- 月ごとの都市別物価上昇率
CREATE TABLE inflation_rate (
    id SERIAL PRIMARY KEY,
    city VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    month INT NOT NULL,
    inflation_rate NUMERIC(5, 2) NOT NULL,
    UNIQUE(city, year, month)
);

-- 都市ごとの収支記録（ユーザーに紐づく）
CREATE TABLE monthly_balance (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    city VARCHAR(100),
    year INT NOT NULL,
    month INT NOT NULL,
    income NUMERIC(10, 2),
    expense NUMERIC(10, 2),
    note TEXT
);

-- クレジットカード
CREATE TABLE credit_card (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    name VARCHAR(100) NOT NULL,
    payment_day INT NOT NULL
);

-- クレジットカード請求
CREATE TABLE credit_card_bill (
    id SERIAL PRIMARY KEY,
    card_id INT REFERENCES credit_card(id),
    billing_year INT NOT NULL,
    billing_month INT NOT NULL,
    payment_year INT NOT NULL,
    payment_month INT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    paid_by_salary_month INT NOT NULL
);

-- クレジットカード請求に含まれる個別支出項目
CREATE TABLE credit_card_item (
    id SERIAL PRIMARY KEY,
    bill_id INT REFERENCES credit_card_bill(id),
    category VARCHAR(100),
    amount NUMERIC(10, 2),
    included_in_summary BOOLEAN DEFAULT TRUE, -- 家計まとめに含むかどうか
    label VARCHAR(100)
);

