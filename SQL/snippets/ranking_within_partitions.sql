-- Script for Ranking Within Partitions
SELECT
    category,
    item_id,
    value,
    -- Assign ranks within each category based on value (descending)
    ROW_NUMBER() OVER (PARTITION BY category ORDER BY value DESC) AS rn, -- Unique rank, sequential
    RANK() OVER (PARTITION BY category ORDER BY value DESC) AS rnk,       -- Rank with gaps for ties
    DENSE_RANK() OVER (PARTITION BY category ORDER BY value DESC) AS drnk -- Rank without gaps for ties
FROM
    your_schema.your_table;