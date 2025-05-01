-- ======================================================================
-- SQL Snippet: Unpivoting Data (Columns to Rows)
-- ======================================================================
-- Purpose: Transforms data from a wide format (multiple value columns)
--          to a long format (attribute-value pairs in rows).
-- Method: This example uses UNION ALL, a standard and widely compatible method.
-- Note: Some databases offer specific UNPIVOT functions (e.g., SQL Server, Oracle) or 
--       lateral joins (e.g., PostgreSQL with CROSS JOIN LATERAL VALUES) which can be more concise.

-- Assume a source table `quarterly_sales_wide` like:
-- | product_id | q1_sales | q2_sales | q3_sales | q4_sales |
-- |------------|----------|----------|----------|----------|
-- | 101        | 100      | 150      | NULL     | 200      |
-- | 102        | 50       | 75       | 90       | NULL     |

-- The query transforms the wide table into a long format.

-- Select data for the first column to unpivot (Q1)
SELECT
    product_id,
    'Q1' AS sales_quarter, -- Literal string indicating the source column
    q1_sales AS sales_amount -- The value from the Q1 column
FROM
    your_schema.quarterly_sales_wide
WHERE q1_sales IS NOT NULL -- Optional: Exclude rows where the value for this quarter is NULL

UNION ALL -- Combines the results of SELECT statements; ALL keeps duplicates (usually desired here)

-- Select data for the second column to unpivot (Q2)
SELECT
    product_id,
    'Q2' AS sales_quarter,
    q2_sales AS sales_amount
FROM
    your_schema.quarterly_sales_wide
WHERE q2_sales IS NOT NULL

UNION ALL

-- Select data for the third column to unpivot (Q3)
SELECT
    product_id,
    'Q3' AS sales_quarter,
    q3_sales AS sales_amount
FROM
    your_schema.quarterly_sales_wide
WHERE q3_sales IS NOT NULL

UNION ALL

-- Select data for the fourth column to unpivot (Q4)
SELECT
    product_id,
    'Q4' AS sales_quarter,
    q4_sales AS sales_amount
FROM
    your_schema.quarterly_sales_wide
WHERE q4_sales IS NOT NULL

-- Final ordering for the combined result set
ORDER BY
    product_id, sales_quarter;