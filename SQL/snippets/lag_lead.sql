-- Script for Lag/Lead (Accessing Previous/Next Rows)
SELECT
    event_timestamp,
    user_id,
    value,
    -- Get the previous value for the same user, ordered by time
    LAG(value, 1, 0) OVER (PARTITION BY user_id ORDER BY event_timestamp ASC) AS previous_value, -- (value, offset, default_if_none)
    -- Get the next timestamp for the same user
    LEAD(event_timestamp) OVER (PARTITION BY user_id ORDER BY event_timestamp ASC) AS next_event_timestamp
FROM
    your_schema.user_events;