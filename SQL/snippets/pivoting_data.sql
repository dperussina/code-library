-- Script for Pivoting Data (Rows to Columns) using Conditional Aggregation
SELECT
    product_id,
    MAX(CASE WHEN sales_month = '2024-01' THEN sales_amount ELSE NULL END) AS sales_jan_2024,
    MAX(CASE WHEN sales_month = '2024-02' THEN sales_amount ELSE NULL END) AS sales_feb_2024,
    MAX(CASE WHEN sales_month = '2024-03' THEN sales_amount ELSE NULL END) AS sales_mar_2024
FROM (
    SELECT
        product_id,
        FORMAT(sales_date, 'yyyy-MM') AS sales_month,
        sales_amount
    FROM
        your_schema.sales_data
) AS MonthlySales
GROUP BY
    product_id
ORDER BY
    product_id;