-- ======================================================================
-- SQL Snippet: Common Table Expression (CTE)
-- ======================================================================
-- Purpose: Demonstrates how to define and use Common Table Expressions (CTEs)
--          to break down complex queries into logical, readable steps.
-- Replace 'your_schema', table names, and column names with actual names.

-- The WITH clause introduces one or more CTEs.
WITH ActiveKeys AS (
    -- Define the first CTE named 'ActiveKeys'.
    -- This CTE finds all foreign keys from table2 that are marked as 'active'.
    -- It acts like a temporary view for the duration of this single query.
    SELECT
        foreign_key_column
    FROM
        your_schema.table2
    WHERE
        filter_column = 'active'
),
AnotherCTE AS (
    -- Define a second CTE, separated by a comma.
    -- This CTE selects 'some_column' from table3 based on a value condition.
    SELECT
        some_column
    FROM
        your_schema.table3
    WHERE value > 50
)
-- Main Query: This query follows the WITH clause and can reference the CTEs defined above.
SELECT
    t1.column1,
    t1.column2
FROM
    your_schema.table1 AS t1 -- Alias the main table
INNER JOIN
    ActiveKeys ak ON t1.key_column = ak.foreign_key_column -- Join the main table with the 'ActiveKeys' CTE
                                                          -- CTEs are referenced by their name (ak here is an alias for ActiveKeys).
WHERE
    -- Use the second CTE ('AnotherCTE') in a subquery within the WHERE clause.
    t1.another_column IN (SELECT some_column FROM AnotherCTE);

-- Key Benefits of CTEs:
-- 1. Readability: Breaks down complex logic into named steps.
-- 2. Reusability: A CTE can be referenced multiple times within the main query (though beware of performance implications in some DBs).
-- 3. Recursion: CTEs can be recursive (see recursive_cte.sql example).