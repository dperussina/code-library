-- Script for Unpivoting Data (Columns to Rows) using UNION ALL
SELECT
    product_id,
    'Q1' AS sales_quarter,
    q1_sales AS sales_amount
FROM
    your_schema.quarterly_sales_wide
WHERE q1_sales IS NOT NULL

UNION ALL

SELECT
    product_id,
    'Q2' AS sales_quarter,
    q2_sales AS sales_amount
FROM
    your_schema.quarterly_sales_wide
WHERE q2_sales IS NOT NULL

UNION ALL

SELECT
    product_id,
    'Q3' AS sales_quarter,
    q3_sales AS sales_amount
FROM
    your_schema.quarterly_sales_wide
WHERE q3_sales IS NOT NULL

UNION ALL

SELECT
    product_id,
    'Q4' AS sales_quarter,
    q4_sales AS sales_amount
FROM
    your_schema.quarterly_sales_wide
WHERE q4_sales IS NOT NULL
ORDER BY
    product_id, sales_quarter;