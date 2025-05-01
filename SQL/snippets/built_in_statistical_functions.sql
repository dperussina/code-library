-- Script for Built-in Statistical Functions
SELECT
    category,
    AVG(value) AS average_value,
    STDDEV_SAMP(value) AS sample_std_dev, -- Sample Standard Deviation
    STDDEV_POP(value) AS population_std_dev, -- Population Standard Deviation
    VAR_SAMP(value) AS sample_variance, -- Sample Variance
    VAR_POP(value) AS population_variance, -- Population Variance
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY value ASC) AS median_continuous, -- Interpolated median
    PERCENTILE_DISC(0.5) WITHIN GROUP (ORDER BY value ASC) AS median_discrete -- Closest value median
FROM
    your_schema.your_data
GROUP BY
    category;

-- Correlation between two columns
SELECT
    CORR(column_a, column_b) AS correlation_coefficient
FROM
    your_schema.paired_data;