CREATE SCHEMA raw_data;
CREATE SCHEMA aggregated;

CREATE TABLE raw_data.orders (
  order_id TEXT,
  created_at TIMESTAMP,
  status TEXT,
  value NUMERIC,
  payment_method TEXT
);

CREATE TABLE aggregated.daily_metrics (
  date DATE,
  status TEXT,
  payment_method TEXT,
  total_orders INT,
  total_revenue NUMERIC
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);