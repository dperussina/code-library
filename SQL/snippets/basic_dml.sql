-- ======================================================================
-- SQL Snippet: Basic Data Manipulation Language (DML)
-- ======================================================================
-- Purpose: Demonstrates fundamental DML operations: INSERT, UPDATE, DELETE.
-- Replace 'your_schema', 'your_table', and column names with actual names.

-- ----------------------------------------------------------------------
-- INSERT Statement: Adding new rows to a table
-- ----------------------------------------------------------------------

-- Example 1: Inserting a single row with specified values.
-- List the target columns and provide corresponding values in the VALUES clause.
INSERT INTO your_schema.your_table (column1, column2, creation_date)
VALUES ('value1', 123, CURRENT_TIMESTAMP); -- Using a function for a value.

-- Example 2: Inserting multiple rows (syntax varies slightly between DBs).
-- Standard SQL (often supported):
INSERT INTO your_schema.your_table (column1, column2) VALUES
('value2', 456),
('value3', 789);
-- Some older DBs might require separate INSERT statements.

-- Example 3: Inserting data based on the result of a SELECT query.
-- Copies data from 'source_table' into 'your_table' where the condition matches.
-- Ensure the selected columns match the target columns in type and order.
INSERT INTO your_schema.your_table (column1, column2)
SELECT source_column_a, source_column_b
FROM your_schema.source_table
WHERE condition = TRUE; -- Replace with your actual condition.

-- ----------------------------------------------------------------------
-- UPDATE Statement: Modifying existing rows in a table
-- ----------------------------------------------------------------------
-- Updates 'column1' and increments 'column2' for rows matching the WHERE clause.
UPDATE your_schema.your_table
SET
    column1 = 'new_value',         -- Set column1 to a literal value.
    column2 = column2 + 1,         -- Update column2 based on its current value.
    last_updated = CURRENT_TIMESTAMP -- Update a timestamp column.
WHERE
    key_column = 123; -- <<< IMPORTANT: Always include a WHERE clause in UPDATE statements
                     -- unless you intend to update *every* row in the table.

-- ----------------------------------------------------------------------
-- DELETE Statement: Removing rows from a table
-- ----------------------------------------------------------------------
-- Deletes rows where the 'date_column' is before the specified date.
DELETE FROM your_schema.your_table
WHERE
    date_column < '2020-01-01'; -- <<< IMPORTANT: Always include a WHERE clause in DELETE statements
                               -- unless you intend to delete *all* rows from the table.