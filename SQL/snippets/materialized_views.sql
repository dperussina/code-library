-- ======================================================================
-- SQL Snippet: Materialized Views (PostgreSQL Example)
-- ======================================================================
-- Purpose: Demonstrates creating and refreshing a materialized view.
--          Materialized views store the result of a query physically,
--          which can improve performance for complex or frequently accessed queries,
--          but requires explicit refreshing to update the stored data.
-- Note: Syntax and features vary across databases (e.g., Oracle, SQL Server have different options).

-- Create a Materialized View
-- Stores the pre-computed sales summary by product.
CREATE MATERIALIZED VIEW your_schema.sales_summary AS
SELECT
    product_id,
    SUM(sales_amount) AS total_sales,
    COUNT(*) AS total_orders
FROM
    your_schema.sales -- Assume this is the base table with sales data
GROUP BY
    product_id;

-- Querying the Materialized View (is fast, reads stored data)
-- SELECT * FROM your_schema.sales_summary WHERE product_id = 123;

-- Refresh the Materialized View
-- Updates the stored data based on the current contents of the underlying table(s).
-- This can be resource-intensive and may lock the view depending on the method.
REFRESH MATERIALIZED VIEW your_schema.sales_summary;

-- Concurrently Refresh (PostgreSQL - less locking, requires a UNIQUE index on the view)
-- REFRESH MATERIALIZED VIEW CONCURRENTLY your_schema.sales_summary;