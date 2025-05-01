-- ======================================================================
-- SQL Snippet: CASE WHEN Statement
-- ======================================================================
-- Purpose: Demonstrates conditional logic within SQL queries using CASE WHEN.
-- Replace 'your_schema', 'your_table', and column names with actual names.

SELECT
    item_id,
    value,
    status, -- Assuming these columns exist for the examples
    type,
    amount,
    
    -- Example 1: Simple Case for Categorization
    -- Assigns a category string based on the value of the 'value' column.
    CASE
        WHEN value > 1000 THEN 'High'
        WHEN value > 500 THEN 'Medium' -- Conditions are evaluated in order; no need for explicit <= 1000 here.
        WHEN value > 0   THEN 'Low'
        ELSE 'Zero or Negative' -- Optional: Catches any cases not covered by the WHEN conditions.
    END AS value_category, -- Alias for the new conditional column.
    
    -- Example 2: Conditional Aggregation using CASE within SUM
    -- Calculates the sum of 'amount' only for rows where status is 'Completed'.
    -- For other statuses, it adds 0 to the sum.
    SUM(CASE WHEN status = 'Completed' THEN amount ELSE 0 END) AS completed_amount_sum,
    
    -- Example 3: Conditional Aggregation using CASE within COUNT
    -- Counts the number of rows where type is 'Urgent'.
    -- CASE returns 1 for matching rows and NULL otherwise (because there's no ELSE).
    -- COUNT(expression) counts non-NULL values, effectively counting only the urgent items.
    COUNT(CASE WHEN type = 'Urgent' THEN 1 END) AS urgent_item_count
    
FROM
    your_schema.your_table
    
GROUP BY -- Required when using aggregate functions (SUM, COUNT) with non-aggregated columns.
    item_id, value, status, type, amount, value_category -- Include all non-aggregated columns selected.
    -- Note: Including value_category in GROUP BY is necessary here because it's calculated before aggregation.
    -- Alternatively, conditional aggregation could be done without grouping if using window functions.
ORDER BY
    item_id;