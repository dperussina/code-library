-- ======================================================================
-- SQL Snippet: Running Aggregates (Window Functions)
-- ======================================================================
-- Purpose: Demonstrates calculating running totals and moving averages using window functions.

SELECT
    order_date,
    category,
    daily_sales, -- The value for the current row/day
    
    -- Running Total: Cumulative sum up to the current row within the partition.
    SUM(daily_sales) 
        OVER (PARTITION BY category ORDER BY order_date ASC 
              ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total_sales,
        -- OVER (...): Defines the window.
        --   PARTITION BY category: Calculation restarts for each category.
        --   ORDER BY order_date ASC: Defines the order for the running calculation.
        --   ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW: Specifies the window frame.
        --     - UNBOUNDED PRECEDING: Start from the very first row in the partition.
        --     - CURRENT ROW: End at the current row being processed.
        --     (This is often the default frame for running totals when ORDER BY is used).

    -- Moving Average: Average over a defined window frame relative to the current row.
    AVG(daily_sales) 
        OVER (PARTITION BY category ORDER BY order_date ASC 
              ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS moving_avg_7day_sales
        --   ROWS BETWEEN 6 PRECEDING AND CURRENT ROW: Defines the frame for the moving average.
        --     - Includes the current row and the 6 preceding rows (total of 7 rows, if available).
        --     - For the first few rows where 6 preceding rows don't exist, the average is calculated over available rows.

FROM
    your_schema.daily_sales_summary; -- Replace with your table name (assumes pre-aggregated daily sales)