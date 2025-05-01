-- ======================================================================
-- SQL Snippet: Advanced Indexing Examples
-- ======================================================================
-- Purpose: Demonstrates various advanced indexing strategies beyond simple single-column indexes.
-- Note: Syntax may vary slightly between different SQL databases (e.g., PostgreSQL, MySQL, SQL Server).
-- Replace 'your_schema' and table/column names with actual names.

-- ----------------------------------------------------------------------
-- Multi-Column Index
-- ----------------------------------------------------------------------
-- Useful for queries filtering or sorting on multiple columns in a specific order.
-- The order of columns (customer_id, then order_date) matters for query optimization.
CREATE INDEX idx_orders_customer_date ON your_schema.orders (customer_id, order_date);

-- ----------------------------------------------------------------------
-- Covering Index
-- ----------------------------------------------------------------------
-- Includes additional columns directly in the index.
-- Allows the database to answer certain queries entirely from the index (index-only scan),
-- avoiding the need to access the main table data, which can be much faster.
-- Here, queries filtering/sorting by customer_id and order_date that also SELECT order_total
-- or order_status might benefit.
CREATE INDEX idx_orders_covering ON your_schema.orders (customer_id, order_date) INCLUDE (order_total, order_status); -- Syntax for including non-key columns varies (e.g., some DBs put them in the main list).

-- ----------------------------------------------------------------------
-- Specialized Index Example (PostgreSQL GiST)
-- ----------------------------------------------------------------------
-- GiST (Generalized Search Tree) indexes are useful for indexing complex data types,
-- such as geometric data (points, polygons) or full-text search vectors.
-- This allows efficient spatial queries (e.g., finding points within a certain distance).
-- Assumes 'locations' table and a geometry/geography type column.
CREATE INDEX idx_locations_gist ON your_schema.locations USING GIST (geography_column);

-- ----------------------------------------------------------------------
-- Specialized Index Example (PostgreSQL GIN)
-- ----------------------------------------------------------------------
-- GIN (Generalized Inverted Index) indexes are optimized for indexing composite values,
-- where each item can contain multiple components (e.g., arrays, JSONB documents, full-text search).
-- Useful for quickly finding rows where a JSONB column contains a specific key or value.
-- `jsonb_path_ops` is an operator class optimized for JSONB path lookups.
-- Assumes 'products' table and a JSONB column named 'tags_column'.
CREATE INDEX idx_jsonb_tags ON your_schema.products USING GIN (tags_column jsonb_path_ops);