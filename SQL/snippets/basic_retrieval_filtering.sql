-- ======================================================================
-- SQL Snippet: Basic Data Retrieval and Filtering
-- ======================================================================
-- Purpose: Demonstrates a basic SELECT statement with various filtering (WHERE),
--          ordering (ORDER BY), and limiting (LIMIT) clauses.
-- Replace 'your_schema', 'your_table', and column names with actual names.

SELECT
    column1,                   -- Select specific columns
    column2,
    column3 AS alias_for_column3, -- Use an alias (AS keyword is optional)
    column4 || ' ' || column5 AS combined_string -- Example: Concatenate columns
FROM
    your_schema.your_table     -- Specify the table to retrieve data from
WHERE
    -- Conditions to filter rows (rows must satisfy *all* ANDed conditions):
    column1 > 100                           -- Numeric comparison (greater than)
    AND column2 >= 50                       -- Numeric comparison (greater than or equal to)
    AND lower(column4) = 'some_value'       -- String equality (use lower() for case-insensitive comparison, if needed)
    AND column5 IN ('value1', 'value2', 'value3') -- Check if column5 is one of the values in the list
    AND date_column BETWEEN '2024-01-01' AND '2024-12-31' -- Check if date_column falls within the specified range (inclusive)
    AND text_column LIKE 'prefix%'             -- Simple pattern matching: starts with 'prefix'
    -- Common LIKE patterns: 
    --   '%suffix' (ends with 'suffix')
    --   '%keyword%' (contains 'keyword')
    --   '_ingle_char' (matches single characters)
    AND another_column IS NOT NULL            -- Check if a column is not NULL
ORDER BY
    column1 DESC,              -- Sort results first by column1 in descending order
    alias_for_column3 ASC      -- Then, for rows with the same column1 value, sort by column3 (using alias) in ascending order (ASC is default)
LIMIT 100;                     -- Restrict the output to the first 100 rows after filtering and sorting.
                               -- Note: LIMIT syntax can vary (e.g., `FETCH FIRST 100 ROWS ONLY` in some DBs, `TOP 100` in SQL Server).