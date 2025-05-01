-- Script for Grouping and Aggregating Data
-- ======================================================================
-- SQL Snippet: Grouping and Aggregating Data
-- ======================================================================
-- Purpose: Demonstrates how to group rows by specific columns and apply
--          various aggregate functions (COUNT, SUM, AVG, MIN, MAX) to each group.
SELECT
    category_column,
    COUNT(*) AS number_of_rows, -- Total rows per category
    COUNT(DISTINCT specific_column) AS distinct_items, -- Count unique values in a column
    SUM(value_column) AS total_value,   -- Sum of all values in value_column per category
    AVG(value_column) AS average_value, -- Average of value_column per category
    MIN(value_column) AS minimum_value, -- Minimum value in value_column per category
    MAX(value_column) AS maximum_value  -- Maximum value in value_column per category
FROM
    your_schema.your_table
WHERE
    -- Optional: Filter rows *before* grouping based on some condition, e.g., date range
    date_column >= '2024-01-01'  -- Only include records from this date onward
GROUP BY
    category_column  -- Group rows by the category_column value
HAVING
    -- Optional: Filter groups *after* aggregation has been applied
    COUNT(*) > 10               -- Only include categories with more than 10 rows
    AND SUM(value_column) > 1000  -- And total_value exceeds 1000
ORDER BY
    total_value DESC;  -- Sort groups by descending aggregated total_value
-- End of SQL Snippet: Grouping and Aggregating Data