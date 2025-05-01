-- Script for Handling NULLs
SELECT
    column1,
    COALESCE(potentially_null_column, 'Default Value') AS column_with_default -- Replace NULLs with a default value
FROM
    your_schema.your_table;

-- Filtering NULLs
SELECT
    column1
FROM
    your_schema.your_table
WHERE
    nullable_column IS NULL; -- Rows where nullable_column is NULL

SELECT
    column1
FROM
    your_schema.your_table
WHERE
    nullable_column IS NOT NULL; -- Rows where nullable_column is NOT NULL