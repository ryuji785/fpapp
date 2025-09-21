CREATE TABLE budget_plans (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    total_amount NUMERIC(19,4) NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE expense_items (
    id UUID PRIMARY KEY,
    plan_id UUID NOT NULL REFERENCES budget_plans(id),
    name VARCHAR(255) NOT NULL,
    amount NUMERIC(19,4) NOT NULL
);

CREATE TABLE life_events (
    id UUID PRIMARY KEY,
    plan_id UUID NOT NULL REFERENCES budget_plans(id),
    name VARCHAR(255) NOT NULL,
    event_date DATE,
    cost NUMERIC(19,4)
);
