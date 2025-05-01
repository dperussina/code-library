-- Script for Grouping and Aggregating Data
SELECT
    category_column,
    COUNT(*) AS number_of_rows, -- Total rows per category
    COUNT(DISTINCT specific_column) AS distinct_items, -- Count unique values in a column
    SUM(value_column) AS total_value,
    AVG(value_column) AS average_value,
    MIN(value_column) AS minimum_value,
    MAX(value_column) AS maximum_value
FROM
    your_schema.your_table
WHERE
    -- Optional: Filter rows *before* grouping
    date_column >= '2024-01-01'
GROUP BY
    category_column -- Group rows with the same value in category_column
HAVING
    -- Optional: Filter groups *after* aggregation
    COUNT(*) > 10 -- Only show categories with more than 10 rows
    AND SUM(value_column) > 1000; -- And total value > 1000
ORDER BY
    total_value DESC;