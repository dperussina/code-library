-- ======================================================================
-- SQL Snippet: LAG and LEAD Window Functions
-- ======================================================================
-- Purpose: Demonstrates how to access data from preceding (LAG) or 
--          succeeding (LEAD) rows within the same result set partition.
-- Useful for calculating differences between consecutive rows, finding next/previous events, etc.

SELECT
    event_timestamp,
    user_id,
    value,
    
    -- LAG(column, offset, default): Accesses data from a previous row.
    --   column: The column whose value you want from the previous row.
    --   offset: How many rows back to look (1 means the immediately preceding row).
    --   default: The value to return if there is no preceding row (e.g., for the first row in a partition).
    LAG(value, 1, 0) 
        OVER (PARTITION BY user_id ORDER BY event_timestamp ASC) AS previous_value, 
        -- OVER(...): Defines the window specification.
        --   PARTITION BY user_id: Apply the function independently within each user's data.
        --   ORDER BY event_timestamp ASC: Define the order within the partition to determine "previous"/"next".
        
    -- LEAD(column, offset, default): Accesses data from a subsequent row.
    --   Parameters are similar to LAG, but it looks forward.
    --   Here, we get the timestamp of the *next* event for the same user.
    --   Default is NULL if not specified and no next row exists.
    LEAD(event_timestamp) 
        OVER (PARTITION BY user_id ORDER BY event_timestamp ASC) AS next_event_timestamp 
FROM
    your_schema.user_events; -- Replace with your table name