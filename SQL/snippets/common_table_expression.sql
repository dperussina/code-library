-- Script for Common Table Expression (CTE)
WITH ActiveKeys AS (
    -- Define a temporary, named result set (CTE)
    SELECT foreign_key_column
    FROM your_schema.table2
    WHERE filter_column = 'active'
), AnotherCTE AS (
    -- You can define multiple CTEs, separating them by commas
    SELECT some_column
    FROM your_schema.table3
    WHERE value > 50
)
-- Main query using the CTE(s)
SELECT
    t1.column1,
    t1.column2
FROM
    your_schema.table1 AS t1
INNER JOIN
    ActiveKeys ak ON t1.key_column = ak.foreign_key_column -- Join with the CTE like a table
WHERE
    t1.another_column IN (SELECT some_column FROM AnotherCTE); -- Can use CTEs in subqueries too