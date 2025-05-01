-- Script for Subquery in WHERE Clause
SELECT
    column1,
    column2
FROM
    your_schema.table1
WHERE
    key_column IN (SELECT foreign_key_column FROM your_schema.table2 WHERE filter_column = 'active');