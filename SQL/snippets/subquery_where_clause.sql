-- ======================================================================
-- SQL Snippet: Subquery in WHERE Clause
-- ======================================================================
-- Purpose: Demonstrates using a subquery (a query nested inside another query)
--          within the WHERE clause to filter results based on values from another table or query.

SELECT
    column1,
    column2
FROM
    your_schema.table1
WHERE
    -- The subquery `(SELECT foreign_key_column FROM ...)` is executed first.
    -- It returns a list of foreign_key_column values where filter_column is 'active'.
    -- The `IN` operator checks if the key_column value from table1 exists in the list returned by the subquery.
    key_column IN (SELECT foreign_key_column FROM your_schema.table2 WHERE filter_column = 'active');
    
-- Other common operators used with subqueries in WHERE:
-- EXISTS: WHERE EXISTS (SELECT 1 FROM table2 WHERE table2.fk = table1.pk AND ...)
-- = / > / < etc.: Used when the subquery is guaranteed to return a single scalar value.
--   e.g., WHERE column1 > (SELECT MAX(value) FROM another_table)