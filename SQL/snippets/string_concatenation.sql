-- Script for String Concatenation
SELECT
    string_col1 || ' ' || string_col2 AS full_string -- Standard SQL Concatenation Operator
FROM
    your_table;

-- Function-based concatenation (more common across dialects)
SELECT
    CONCAT(string_col1, ' ', string_col2) AS full_string
FROM
    your_table;