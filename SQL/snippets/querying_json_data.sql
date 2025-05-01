-- ======================================================================
-- SQL Snippet: Querying JSON Data (PostgreSQL Example)
-- ======================================================================
-- Purpose: Demonstrates how to extract data from JSON or JSONB columns using PostgreSQL operators.
-- Note: JSON querying syntax is highly database-specific.
--       Other DBs (SQL Server, MySQL, Oracle) have different functions/operators.

SELECT
    id,
    -- Operator -> : Gets JSON object field by key (returns JSON).
    -- Operator ->> : Gets JSON object field by key as text (returns TEXT).
    json_data_column ->> 'name' AS user_name, -- Extract the 'name' field as text
    
    -- Chaining operators to access nested fields:
    (json_data_column -> 'address' ->> 'city') AS city, -- Get address object, then extract city as text
    
    -- Accessing JSON array elements (0-indexed):
    (json_data_column -> 'orders' -> 0 ->> 'order_id') AS first_order_id -- Get orders array, then 1st element, then order_id as text
FROM
    your_schema.table_with_json -- Assume json_data_column is JSON or JSONB type
WHERE
    -- Filter based on JSON values:
    json_data_column ->> 'status' = 'active' -- Filter where status field is 'active'
    -- Cast JSON value to a SQL type for comparison:
    AND (json_data_column -> 'settings' ->> 'beta_enabled')::BOOLEAN = TRUE; -- Extract beta_enabled as text and cast to boolean