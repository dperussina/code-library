-- ======================================================================
-- SQL Snippet: Various JOIN Types
-- ======================================================================
-- Purpose: Demonstrates different ways to combine rows from two or more tables.
-- Replace 'your_schema', table names, and column names with actual names.

-- Assume two tables for most examples:
-- customers (customer_id PK, name, email)
-- orders (order_id PK, customer_id FK, order_date, amount)

-- ----------------------------------------------------------------------
-- INNER JOIN
-- ----------------------------------------------------------------------
-- Returns only rows where the join condition is met in *both* tables.
-- Rows from either table that do not have a match in the other table are excluded.
SELECT
    c.customer_id,
    c.name,
    o.order_id,
    o.order_date,
    o.amount
FROM
    your_schema.customers AS c
INNER JOIN -- Combine customers and their orders
    your_schema.orders AS o
    ON c.customer_id = o.customer_id; -- Match based on the customer_id

-- ----------------------------------------------------------------------
-- LEFT JOIN (or LEFT OUTER JOIN)
-- ----------------------------------------------------------------------
-- Returns all rows from the *left* table (customers) and matching rows from the *right* table (orders).
-- If a customer has no orders, their columns from the customers table are still returned,
-- but the columns from the orders table will be NULL.
SELECT
    c.customer_id,
    c.name,
    o.order_id, -- Will be NULL if a customer has no orders
    o.order_date, -- Will be NULL if a customer has no orders
    o.amount -- Will be NULL if a customer has no orders
FROM
    your_schema.customers AS c
LEFT JOIN -- Keep all customers, match orders where possible
    your_schema.orders AS o
    ON c.customer_id = o.customer_id;

-- ----------------------------------------------------------------------
-- RIGHT JOIN (or RIGHT OUTER JOIN)
-- ----------------------------------------------------------------------
-- Returns all rows from the *right* table (orders) and matching rows from the *left* table (customers).
-- If an order belongs to a customer not present in the customers table (unlikely with FK constraints, but possible),
-- that order's details are still returned, but the columns from the customers table will be NULL.
-- Often less intuitive than LEFT JOIN; consider rewriting as LEFT JOIN by swapping table order.
SELECT
    c.customer_id, -- Will be NULL if an order has no matching customer
    c.name, -- Will be NULL if an order has no matching customer
    o.order_id,
    o.order_date,
    o.amount
FROM
    your_schema.customers AS c
RIGHT JOIN -- Keep all orders, match customers where possible
    your_schema.orders AS o
    ON c.customer_id = o.customer_id;

-- ----------------------------------------------------------------------
-- FULL JOIN (or FULL OUTER JOIN)
-- ----------------------------------------------------------------------
-- Returns all rows from *both* tables.
-- If a row in one table doesn't have a match in the other, NULL values are used for the columns from the missing table.
-- Effectively combines the results of a LEFT JOIN and a RIGHT JOIN.
SELECT
    COALESCE(c.customer_id, o.customer_id) AS customer_id, -- Use COALESCE if keys can be NULL
    c.name, -- Will be NULL if an order has no matching customer
    o.order_id, -- Will be NULL if a customer has no orders
    o.order_date,
    o.amount
FROM
    your_schema.customers AS c
FULL OUTER JOIN -- Keep all customers AND all orders
    your_schema.orders AS o
    ON c.customer_id = o.customer_id;

-- ----------------------------------------------------------------------
-- CROSS JOIN
-- ----------------------------------------------------------------------
-- Returns the Cartesian product of the two tables - every row from the first table combined with every row from the second.
-- No ON clause is used.
-- Use with caution, as the result set can become very large quickly (rows_table1 * rows_table2).
SELECT
    c.name,
    p.product_name
FROM
    your_schema.customers AS c
CROSS JOIN
    your_schema.products AS p; -- Assuming a products table

-- ----------------------------------------------------------------------
-- Self Join
-- ----------------------------------------------------------------------
-- Joining a table to itself, typically to compare rows within the same table.
-- Requires using aliases to distinguish the two instances of the table.
-- Example: Find employees and their managers (assuming 'employees' table has employee_id, name, manager_id)
SELECT
    e.name AS employee_name,
    m.name AS manager_name
FROM
    your_schema.employees AS e
LEFT JOIN -- Use LEFT JOIN to include employees without a manager (e.g., CEO)
    your_schema.employees AS m -- Alias the same table as 'm' for managers
    ON e.manager_id = m.employee_id; -- Join employee's manager_id to manager's employee_id

-- ----------------------------------------------------------------------
-- APPLY Operators (SQL Server / Oracle Specific)
-- ----------------------------------------------------------------------
-- APPLY allows invoking a table-valued function or correlated subquery for each row from an outer table.
-- Not standard JOINs, but used for related row-by-row processing.

-- CROSS APPLY: Similar to INNER JOIN. Returns only rows from the outer table where the
--              table-valued expression (function/subquery) returns rows.
-- Example: Get top N orders for each customer (SQL Server syntax)
-- SELECT c.customer_id, c.name, oa.order_id, oa.amount
-- FROM your_schema.customers AS c
-- CROSS APPLY (
--     SELECT TOP 3 o.order_id, o.amount
--     FROM your_schema.orders AS o
--     WHERE o.customer_id = c.customer_id -- Correlated condition
--     ORDER BY o.amount DESC
-- ) AS oa;

-- OUTER APPLY: Similar to LEFT JOIN. Returns all rows from the outer table.
--              If the table-valued expression returns rows, they are included;
--              otherwise, NULLs are returned for the columns from the expression.
-- Example: Get customers and their latest order, even if they have no orders (SQL Server syntax)
-- SELECT c.customer_id, c.name, la.order_id, la.order_date
-- FROM your_schema.customers AS c
-- OUTER APPLY (
--     SELECT TOP 1 o.order_id, o.order_date
--     FROM your_schema.orders AS o
--     WHERE o.customer_id = c.customer_id
--     ORDER BY o.order_date DESC
-- ) AS la;