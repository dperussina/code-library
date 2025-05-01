-- Script for Running Aggregates
SELECT
    order_date,
    category,
    daily_sales,
    -- Calculate cumulative sales for each category up to the current date
    SUM(daily_sales) OVER (PARTITION BY category ORDER BY order_date ASC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total_sales,
    -- Calculate 7-day moving average sales for each category
    AVG(daily_sales) OVER (PARTITION BY category ORDER BY order_date ASC ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS moving_avg_7day_sales
FROM
    your_schema.daily_sales_summary;