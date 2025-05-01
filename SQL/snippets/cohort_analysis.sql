-- ======================================================================
-- SQL Snippet: Cohort Analysis (Monthly Retention)
-- ======================================================================
-- Purpose: Calculates monthly user retention based on the month a user first became active.
-- Database: Primarily tested on PostgreSQL, syntax for date functions (DATE_TRUNC, EXTRACT) might differ.
-- Replace 'your_schema' and table/column names.

-- Step 1: Determine the cohort for each user.
-- A user's cohort is typically defined by the time period (e.g., month) of their first activity/signup.
WITH UserCohorts AS (
    SELECT
        user_id,
        -- Find the first activity month for each user.
        -- DATE_TRUNC('month', ...) truncates the date/timestamp to the first day of the month.
        MIN(DATE_TRUNC('month', activity_date)) AS cohort_month
    FROM
        your_schema.user_activity -- Assumes a table with user_id and activity_date
    GROUP BY
        user_id
),
-- Step 2: Join user activity with their cohort information.
-- Calculate the "month number" representing the number of months between the cohort month
-- and the activity month (0 for activity in the cohort month, 1 for the next month, etc.).
ActivityWithCohorts AS (
    SELECT
        act.user_id,
        act.activity_date,
        cohort.cohort_month,
        -- Calculate the difference in months between activity and cohort month.
        -- This calculation works across year boundaries.
        (EXTRACT(YEAR FROM act.activity_date) - EXTRACT(YEAR FROM cohort.cohort_month)) * 12 +
        (EXTRACT(MONTH FROM act.activity_date) - EXTRACT(MONTH FROM cohort.cohort_month)) AS month_number
    FROM
        your_schema.user_activity AS act
    JOIN
        UserCohorts AS cohort ON act.user_id = cohort.user_id
),
-- Step 3: Count distinct active users for each cohort in each subsequent month number.
CohortActivityCounts AS (
    SELECT
        cohort_month,
        month_number, -- How many months after joining the cohort was the activity?
        COUNT(DISTINCT user_id) AS active_users -- Count unique users active in that month for that cohort.
    FROM
        ActivityWithCohorts
    GROUP BY
        cohort_month,
        month_number
),
-- Step 4: Determine the initial size of each cohort.
-- The size is the number of users active in month_number = 0 (their first month).
CohortSizes AS (
    SELECT
        cohort_month,
        active_users AS cohort_size
    FROM
        CohortActivityCounts
    WHERE
        month_number = 0 -- Filter for the initial month's activity count
)
-- Step 5: Join the monthly activity counts with cohort sizes and calculate retention percentage.
SELECT
    counts.cohort_month,
    sizes.cohort_size,
    counts.month_number,
    counts.active_users,
    -- Calculate retention: (active users in month N / total users in cohort) * 100
    -- Cast to FLOAT for accurate division before multiplying.
    (counts.active_users::FLOAT / sizes.cohort_size) * 100.0 AS retention_percentage
FROM
    CohortActivityCounts AS counts
JOIN
    CohortSizes AS sizes ON counts.cohort_month = sizes.cohort_month
ORDER BY
    counts.cohort_month, -- Order results chronologically by cohort
    counts.month_number; -- And then by month number within each cohort