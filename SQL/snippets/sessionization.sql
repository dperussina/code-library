-- ======================================================================
-- SQL Snippet: Sessionization using Window Functions (PostgreSQL Example)
-- ======================================================================
-- Purpose: Groups user events into sessions based on inactivity time (e.g., 30 minutes).
--          Assigns a unique session ID to each group of events.
-- Database: Uses PostgreSQL specific functions (LAG, EXTRACT EPOCH). Adapt for other DBs.

-- Step 1: Calculate time difference between consecutive events for each user.
WITH EventTiming AS (
    SELECT
        event_id,       -- Unique identifier for the event
        user_id,        -- Identifier for the user
        event_timestamp,-- Timestamp of the event
        
        -- Get the timestamp of the *previous* event for the same user.
        LAG(event_timestamp, 1) -- Offset 1 = previous row
            OVER (PARTITION BY user_id ORDER BY event_timestamp ASC) AS prev_event_timestamp
            -- Partition by user_id: Look at events for each user separately.
            -- Order by timestamp: Determine previous/next based on time.
    FROM
        your_schema.user_events -- Assumes a table with event data
),
-- Step 2: Identify the start of a new session.
-- A new session starts if it's the user's first event OR if the time since the 
-- previous event exceeds the inactivity threshold (e.g., 30 minutes).
SessionStartFlag AS (
    SELECT
        event_id,
        user_id,
        event_timestamp,
        prev_event_timestamp,
        
        -- Calculate minutes since last event (handle NULL for the first event).
        CASE 
            WHEN prev_event_timestamp IS NOT NULL 
            THEN EXTRACT(EPOCH FROM (event_timestamp - prev_event_timestamp))/60 
            ELSE NULL 
        END AS minutes_since_last_event, -- Using EXTRACT(EPOCH FROM interval)/60 for minutes

        -- Flag indicating the start of a new session (1 if start, 0 otherwise).
        CASE
            WHEN prev_event_timestamp IS NULL -- First event for the user is always a new session
                 OR (EXTRACT(EPOCH FROM (event_timestamp - prev_event_timestamp))/60) > 30 -- Or time gap > 30 mins
                THEN 1
            ELSE 0
        END AS is_new_session_start
    FROM
        EventTiming
),
-- Step 3: Assign a session sequence number.
-- Use a running sum of the `is_new_session_start` flag. Each time the flag is 1, 
-- the sum increments, effectively creating a sequence number for each session within the user partition.
SessionAssignment AS (
    SELECT
        event_id,
        user_id,
        event_timestamp,
        minutes_since_last_event,
        is_new_session_start,
        
        -- Calculate the running sum of the start flag to create a session group number.
        SUM(is_new_session_start) 
            OVER (PARTITION BY user_id ORDER BY event_timestamp ASC 
                  ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS session_sequence 
    FROM
        SessionStartFlag
)
-- Final Step: Construct the session ID and select desired columns.
SELECT
    event_id,
    user_id,
    event_timestamp,
    minutes_since_last_event,
    -- Concatenate user_id and the session sequence number for a unique session ID.
    user_id || '_' || session_sequence AS session_id 
FROM
    SessionAssignment
ORDER BY
    user_id, event_timestamp; -- Order the final output