-- ======================================================================
-- SQL Snippet: Recursive Common Table Expression (CTE)
-- ======================================================================
-- Purpose: Demonstrates how to traverse hierarchical data (like an employee org chart
--          or a category tree) using a recursive CTE.

-- WITH RECURSIVE: Keyword to define a recursive CTE (syntax might be just WITH in some DBs like SQL Server).
WITH RECURSIVE EmployeeHierarchy AS (
    -- Anchor Member: This is the base case of the recursion.
    -- It selects the starting point(s) of the hierarchy (e.g., top-level managers).
    SELECT
        employee_id,
        employee_name,
        manager_id, -- The column linking to the next level up
        1 AS level  -- Initialize the hierarchy level
    FROM
        your_schema.employees
    WHERE
        manager_id IS NULL -- Select employees with no manager (top level)
        -- Alternatively, start from a specific employee: WHERE employee_id = <some_id>

    UNION ALL -- Connects the anchor member to the recursive member.
              -- Important: Use UNION ALL, not UNION, to avoid potential infinite loops 
              -- and include duplicates if necessary (though usually not needed here).

    -- Recursive Member: This part references the CTE itself (EmployeeHierarchy).
    -- It joins the base table (employees) back to the results found in the previous iteration
    -- of the CTE, based on the hierarchical relationship (manager_id = employee_id).
    SELECT
        e.employee_id,
        e.employee_name,
        e.manager_id,
        eh.level + 1 -- Increment the level for each step down the hierarchy
    FROM
        your_schema.employees AS e
    INNER JOIN
        EmployeeHierarchy AS eh ON e.manager_id = eh.employee_id -- Join employee to their manager from the previous level
    -- Optional: Add a condition to limit recursion depth and prevent potential infinite loops 
    -- if there are cycles in your data (e.g., employee A reports to B, B reports to A).
    -- WHERE eh.level < 10 
)
-- Final SELECT: Query the results accumulated in the recursive CTE.
SELECT
    employee_id,
    employee_name,
    manager_id,
    level
FROM
    EmployeeHierarchy
ORDER BY
    level, employee_name; -- Order the results for clarity