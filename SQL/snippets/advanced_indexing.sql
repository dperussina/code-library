-- Script for Advanced Indexing
-- Multi-Column Index Example
CREATE INDEX idx_orders_customer_date ON your_schema.orders (customer_id, order_date);

-- Covering Index Example
CREATE INDEX idx_orders_covering ON your_schema.orders (customer_id, order_date) INCLUDE (order_total, order_status);

-- Specialized Index Example (PostgreSQL GiST for geometric data)
CREATE INDEX idx_locations_gist ON your_schema.locations USING GIST (geography_column);

-- Specialized Index Example (PostgreSQL GIN for JSONB data)
CREATE INDEX idx_jsonb_tags ON your_schema.products USING GIN (tags_column jsonb_path_ops);