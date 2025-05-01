-- ======================================================================
-- SQL Snippet: Handling NULL Values
-- ======================================================================
-- Purpose: Demonstrates common techniques for dealing with NULL values in SQL,
--          including providing defaults and filtering.

-- ----------------------------------------------------------------------
-- Replacing NULLs with a Default Value using COALESCE
-- ----------------------------------------------------------------------
SELECT
    column1,
    -- COALESCE returns the first non-NULL value from its arguments.
    -- If potentially_null_column is NULL, it returns 'Default Value'.
    -- If it's not NULL, it returns the column's value.
    -- Can take multiple arguments: COALESCE(col1, col2, 'Default') returns first non-null of col1 or col2, else 'Default'.
    COALESCE(potentially_null_column, 'Default Value') AS column_with_default 
FROM
    your_schema.your_table;
-- Note: Some databases have specific functions like IFNULL (MySQL) or ISNULL (SQL Server),
-- but COALESCE is standard SQL and more widely compatible.

-- ----------------------------------------------------------------------
-- Filtering Rows Based on NULL Values
-- ----------------------------------------------------------------------
-- Select rows where a specific column *is* NULL.
-- Standard comparison operators (=, !=, <>) don't work reliably with NULL.
SELECT
    column1
FROM
    your_schema.your_table
WHERE
    nullable_column IS NULL; -- Use `IS NULL` to check for NULL.

-- Select rows where a specific column is *not* NULL.
SELECT
    column1
FROM
    your_schema.your_table
WHERE
    nullable_column IS NOT NULL; -- Use `IS NOT NULL` to check for non-NULL values.