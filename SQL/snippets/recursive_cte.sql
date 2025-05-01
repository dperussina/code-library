-- Script for Recursive Common Table Expressions (CTEs)
WITH RECURSIVE EmployeeHierarchy AS (
    -- Anchor Member: Start with the top-level manager(s)
    SELECT
        employee_id,
        employee_name,
        manager_id,
        1 AS level -- Start at level 1
    FROM
        your_schema.employees
    WHERE
        manager_id IS NULL -- Or specify a starting employee_id

    UNION ALL

    -- Recursive Member: Join employees to their managers found in the previous step
    SELECT
        e.employee_id,
        e.employee_name,
        e.manager_id,
        eh.level + 1 -- Increment level
    FROM
        your_schema.employees AS e
    INNER JOIN
        EmployeeHierarchy AS eh ON e.manager_id = eh.employee_id
    WHERE
        eh.level < 10 -- Optional: Limit recursion depth to prevent infinite loops
)
-- Select from the generated hierarchy
SELECT
    employee_id,
    employee_name,
    manager_id,
    level
FROM
    EmployeeHierarchy
ORDER BY
    level, employee_name;