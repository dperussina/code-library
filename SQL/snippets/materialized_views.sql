-- Script for Materialized Views
-- Create a Materialized View
CREATE MATERIALIZED VIEW your_schema.sales_summary AS
SELECT
    product_id,
    SUM(sales_amount) AS total_sales,
    COUNT(*) AS total_orders
FROM
    your_schema.sales
GROUP BY
    product_id;

-- Refresh the Materialized View
REFRESH MATERIALIZED VIEW your_schema.sales_summary;