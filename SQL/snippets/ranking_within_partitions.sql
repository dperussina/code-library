-- ======================================================================
-- SQL Snippet: Ranking Functions (Window Functions)
-- ======================================================================
-- Purpose: Demonstrates common ranking window functions (ROW_NUMBER, RANK, DENSE_RANK)
--          to assign ranks to rows within specific partitions (groups) of a result set.

SELECT
    category,
    item_id,
    value,
    -- Assign ranks within each category based on value (descending).
    -- OVER clause defines the window (partitioning and ordering).
    
    -- ROW_NUMBER(): Assigns a unique, sequential integer to each row within its partition.
    --               If there are ties in `value`, assigns distinct numbers arbitrarily.
    ROW_NUMBER() OVER (PARTITION BY category ORDER BY value DESC) AS rn, 
                       -- PARTITION BY category: Ranking is done independently for each category.
                       -- ORDER BY value DESC: Rank is based on `value` in descending order.
                       
    -- RANK(): Assigns ranks based on the ORDER BY clause. 
    --         Tied values receive the same rank. Causes gaps in the sequence (e.g., 1, 2, 2, 4).
    RANK() OVER (PARTITION BY category ORDER BY value DESC) AS rnk,       
                       
    -- DENSE_RANK(): Assigns ranks based on the ORDER BY clause.
    --               Tied values receive the same rank. Does *not* cause gaps (e.g., 1, 2, 2, 3).
    DENSE_RANK() OVER (PARTITION BY category ORDER BY value DESC) AS drnk 
                       
FROM
    your_schema.your_table; -- Replace with your table name