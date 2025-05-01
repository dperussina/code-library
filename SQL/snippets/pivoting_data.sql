-- ======================================================================
-- SQL Snippet: Pivoting Data (Rows to Columns)
-- ======================================================================
-- Purpose: Transforms data from a row-oriented format to a column-oriented format.
--          This example uses conditional aggregation, a common cross-database method.
-- Note: Some databases offer specific PIVOT functions (e.g., SQL Server, Oracle) which can be more concise.

-- Example: Transform monthly sales data into columns for each month.
SELECT
    product_id,
    -- Use conditional aggregation: Apply an aggregate (MAX, SUM, AVG) to a CASE statement.
    -- The CASE statement isolates the value for a specific month for each product.
    -- MAX (or MIN or SUM) is used here assuming only one sales_amount per product_id per month.
    -- If multiple sales per month are possible, SUM might be more appropriate.
    MAX(CASE WHEN sales_month = '2024-01' THEN sales_amount ELSE NULL END) AS sales_jan_2024,
    MAX(CASE WHEN sales_month = '2024-02' THEN sales_amount ELSE NULL END) AS sales_feb_2024,
    MAX(CASE WHEN sales_month = '2024-03' THEN sales_amount ELSE NULL END) AS sales_mar_2024
    -- Add more columns for other months as needed.
FROM (
    -- Subquery or CTE to prepare the data, ensuring we have the grouping key (product_id)
    -- and the column whose values will become the new column headers (sales_month).
    SELECT
        product_id,
        -- Format the date to get 'YYYY-MM' format. Function may vary (e.g., TO_CHAR, DATE_FORMAT).
        TO_CHAR(sales_date, 'YYYY-MM') AS sales_month, -- PostgreSQL/Oracle example
        -- FORMAT(sales_date, 'yyyy-MM') AS sales_month, -- SQL Server example
        sales_amount
    FROM
        your_schema.sales_data
) AS MonthlySales -- Alias for the subquery
GROUP BY
    product_id -- Group by the entity you want on each row of the pivoted output.
ORDER BY
    product_id;