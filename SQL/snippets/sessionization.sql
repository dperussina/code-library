-- Script for Sessionization
WITH EventTiming AS (
    SELECT
        event_id,
        user_id,
        event_timestamp,
        LAG(event_timestamp, 1) OVER (PARTITION BY user_id ORDER BY event_timestamp ASC) AS prev_event_timestamp
    FROM
        your_schema.user_events
),
SessionStartFlag AS (
    SELECT
        event_id,
        user_id,
        event_timestamp,
        prev_event_timestamp,
        EXTRACT(EPOCH FROM (event_timestamp - prev_event_timestamp))/60 AS minutes_since_last_event,
        CASE
            WHEN prev_event_timestamp IS NULL
                 OR (EXTRACT(EPOCH FROM (event_timestamp - prev_event_timestamp))/60) > 30
                THEN 1
            ELSE 0
        END AS is_new_session_start
    FROM
        EventTiming
),
SessionAssignment AS (
    SELECT
        event_id,
        user_id,
        event_timestamp,
        minutes_since_last_event,
        is_new_session_start,
        SUM(is_new_session_start) OVER (PARTITION BY user_id ORDER BY event_timestamp ASC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS session_sequence
    FROM
        SessionStartFlag
)
SELECT
    event_id,
    user_id,
    event_timestamp,
    minutes_since_last_event,
    user_id || '_' || session_sequence AS session_id
FROM
    SessionAssignment
ORDER BY
    user_id, event_timestamp;