-- Script for Basic Data Manipulation Language (DML)
-- Inserting Data
INSERT INTO your_schema.your_table (column1, column2) VALUES ('value1', 123);

-- Insert results from a SELECT query
INSERT INTO your_schema.your_table (column1, column2)
SELECT source_column_a, source_column_b FROM your_schema.source_table WHERE condition;

-- Updating Data
UPDATE your_schema.your_table
SET
    column1 = 'new_value',
    column2 = column2 + 1 -- Can use existing values
WHERE
    key_column = 123; -- IMPORTANT: Always use WHERE to avoid updating all rows!

-- Deleting Data
DELETE FROM your_schema.your_table
WHERE
    date_column < '2020-01-01'; -- IMPORTANT: Always use WHERE to avoid deleting all rows!