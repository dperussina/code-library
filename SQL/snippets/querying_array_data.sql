-- ======================================================================
-- SQL Snippet: Querying Array Data (PostgreSQL Example)
-- ======================================================================
-- Purpose: Demonstrates how to work with array data types in PostgreSQL.
-- Note: Array support and syntax are highly database-specific. These examples are for PostgreSQL.

-- Example 1: Unnesting Array Elements (Array to Rows)
-- Transforms each element of an array into its own row.
SELECT
    id,        -- The original row identifier
    tag        -- The individual element extracted from the array
FROM
    your_schema.table_with_array
CROSS JOIN
    -- UNNEST(array_column) expands the array into a set of rows.
    -- CROSS JOIN combines each original row with each expanded array element.
    UNNEST(tags_array_column) AS tag; -- Assuming tags_array_column contains arrays like {'sql', 'python', 'data'}

-- Example 2: Filtering based on Array Contents
-- Find rows where the array contains a specific element or elements.
SELECT
    id,
    tags_array_column
FROM
    your_schema.table_with_array
WHERE
    -- Use the `&&` (overlap) operator to check if the array shares any elements with another array.
    -- tags_array_column && ARRAY['python', 'java'];
    
    -- Use the `@>` (contains) operator to check if the array contains all elements of another array.
    tags_array_column @> ARRAY['python'];
    
    -- Use the `<@` (is contained by) operator to check if all elements of the array exist in another array.
    -- ARRAY['sql'] <@ tags_array_column;
    
    -- Use the ANY operator to check if a scalar value equals any element in the array.
    -- 'sql' = ANY(tags_array_column);