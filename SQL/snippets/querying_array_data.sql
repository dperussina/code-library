-- Script for Querying Array Data
-- Example: Expand array elements into separate rows
SELECT
    id,
    tag -- Each tag gets its own row
FROM
    your_schema.table_with_array
CROSS JOIN -- Often used with UNNEST
    UNNEST(tags_array_column) AS tag; -- tags_array_column is like ['sql', 'python', 'data']

-- Example: Find rows where an array contains a specific element
SELECT
    id,
    tags_array_column
FROM
    your_schema.table_with_array
WHERE
    -- PostgreSQL array contains operator
    tags_array_column @> ARRAY['python'];