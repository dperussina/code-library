-- Script for Cohort Analysis (Retention)
WITH UserCohorts AS (
    SELECT
        user_id,
        MIN(DATE_TRUNC('month', activity_date)) AS cohort_month
    FROM
        your_schema.user_activity
    GROUP BY
        user_id
),
ActivityWithCohorts AS (
    SELECT
        act.user_id,
        act.activity_date,
        cohort.cohort_month,
        (EXTRACT(YEAR FROM act.activity_date) - EXTRACT(YEAR FROM cohort.cohort_month)) * 12 +
        (EXTRACT(MONTH FROM act.activity_date) - EXTRACT(MONTH FROM cohort.cohort_month)) AS month_number
    FROM
        your_schema.user_activity AS act
    JOIN
        UserCohorts AS cohort ON act.user_id = cohort.user_id
),
CohortActivityCounts AS (
    SELECT
        cohort_month,
        month_number,
        COUNT(DISTINCT user_id) AS active_users
    FROM
        ActivityWithCohorts
    GROUP BY
        cohort_month,
        month_number
),
CohortSizes AS (
    SELECT
        cohort_month,
        active_users AS cohort_size
    FROM
        CohortActivityCounts
    WHERE
        month_number = 0
)
SELECT
    counts.cohort_month,
    sizes.cohort_size,
    counts.month_number,
    counts.active_users,
    (counts.active_users::FLOAT / sizes.cohort_size) * 100.0 AS retention_percentage
FROM
    CohortActivityCounts AS counts
JOIN
    CohortSizes AS sizes ON counts.cohort_month = sizes.cohort_month
ORDER BY
    counts.cohort_month,
    counts.month_number;