-- ======================================================================
-- SQL Snippet: String Concatenation
-- ======================================================================
-- Purpose: Demonstrates common ways to combine (concatenate) strings in SQL.

-- Method 1: Using the Standard SQL Concatenation Operator `||`
-- This is the standard operator but might not be supported in all older DB versions (e.g., older SQL Server used `+`).
SELECT
    first_name || ' ' || last_name AS full_name -- Combines first name, a space, and last name
FROM
    your_schema.users;

-- Method 2: Using the CONCAT() Function
-- CONCAT is generally more portable across different database systems.
-- Behavior with NULL arguments can vary: some return NULL if any argument is NULL, others treat NULL as empty string.
SELECT
    CONCAT(street_address, ', ', city, ', ', state_code) AS full_address
FROM
    your_schema.addresses;

-- Method 3: Using CONCAT_WS() (Concatenate With Separator) - If available (e.g., PostgreSQL, MySQL)
-- This function conveniently handles separators and often skips NULL arguments.
-- SELECT CONCAT_WS(' - ', col1, col2, col3) AS concatenated_ws FROM your_table; -- Example: col1 - col2 - col3