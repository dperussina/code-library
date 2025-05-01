-- Script for Inner Join (Matching Rows Only)
SELECT
    t1.key_column,
    t1.column_a,
    t2.column_b
FROM
    your_schema.table1 AS t1 -- Use table aliases for brevity
INNER JOIN
    your_schema.table2 AS t2
    ON t1.key_column = t2.foreign_key_column; -- Join condition based on related columns