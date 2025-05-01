-- ======================================================================
-- SQL Snippet: Built-in Statistical Aggregate Functions
-- ======================================================================
-- Purpose: Demonstrates common statistical functions used with GROUP BY.
-- Note: Function names and availability may vary between database systems
--       (e.g., STDDEV vs STDEV, variance functions, percentile functions).
-- Replace 'your_schema', table names, and column names with actual names.

-- ----------------------------------------------------------------------
-- Statistics per Group
-- ----------------------------------------------------------------------
SELECT
    category, -- The grouping column
    
    -- Basic descriptive statistics:
    AVG(value) AS average_value,           -- Average of the 'value' column for each category
    SUM(value) AS total_value,             -- Sum of the 'value' column for each category
    COUNT(value) AS count_value,           -- Count of non-NULL 'value's for each category
    COUNT(*) AS count_total_rows,          -- Count of total rows in each category
    MIN(value) AS minimum_value,           -- Minimum value in each category
    MAX(value) AS maximum_value,           -- Maximum value in each category
    
    -- Standard Deviation (check your DB's specific function names):
    STDDEV_SAMP(value) AS sample_std_dev,    -- Sample Standard Deviation (uses N-1 denominator)
    STDDEV_POP(value) AS population_std_dev, -- Population Standard Deviation (uses N denominator)
    -- Alternatively: STDDEV(value), STDEV(value), STDEVP(value)
    
    -- Variance (check your DB's specific function names):
    VAR_SAMP(value) AS sample_variance,      -- Sample Variance (uses N-1 denominator)
    VAR_POP(value) AS population_variance,   -- Population Variance (uses N denominator)
    -- Alternatively: VARIANCE(value), VAR(value), VARP(value)
    
    -- Median (Syntax is often database-specific):
    -- PostgreSQL / SQL Standard approach:
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY value ASC) AS median_continuous, -- Interpolated median (50th percentile)
    PERCENTILE_DISC(0.5) WITHIN GROUP (ORDER BY value ASC) AS median_discrete    -- Closest value median (50th percentile)
    -- Other DBs might use MEDIAN(value) or other functions.
FROM
    your_schema.your_data -- The table containing the data
GROUP BY
    category             -- Group the results by the values in the 'category' column
ORDER BY
    category;            -- Optional: Order the final results

-- ----------------------------------------------------------------------
-- Correlation between two columns (across the entire table)
-- ----------------------------------------------------------------------
-- Calculates the Pearson correlation coefficient between two numeric columns.
SELECT
    CORR(column_a, column_b) AS correlation_coefficient
FROM
    your_schema.paired_data; -- Assumes a table with paired numerical data