-- Script for CASE WHEN Statement
SELECT
    item_id,
    value,
    -- Create a new column based on conditions
    CASE
        WHEN value > 1000 THEN 'High'
        WHEN value > 500 AND value <= 1000 THEN 'Medium' -- Conditions evaluated in order
        WHEN value > 0 THEN 'Low'
        ELSE 'Zero or Negative' -- Optional default case
    END AS value_category,
    -- Use CASE inside an aggregate function (Conditional Aggregation)
    SUM(CASE WHEN status = 'Completed' THEN amount ELSE 0 END) AS completed_amount_sum,
    COUNT(CASE WHEN type = 'Urgent' THEN 1 END) AS urgent_item_count -- COUNT ignores NULLs, so no ELSE needed
FROM
    your_schema.your_table
GROUP BY -- Required if using conditional aggregation without window functions
    item_id, value, value_category; -- Group by non-aggregated columns