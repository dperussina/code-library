# SQL Code Snippets Library: Advanced Examples

This document explores more advanced SQL patterns and techniques often used for complex analysis, data transformation, or handling non-traditional data structures within the database.

**Crucial Reminder:** Advanced features, especially those dealing with procedural logic, specialized data types (JSON, arrays), or performance tuning, are **highly dialect-specific**. Always consult the documentation for your specific database system (PostgreSQL, SQL Server, MySQL, Oracle, BigQuery, Snowflake, etc.). The examples provided aim to illustrate the *concept* using common or standard approaches where possible.

---

**1. Recursive Common Table Expressions (CTEs)**

*   **What it does:** Queries hierarchical or graph-like data structures (like organizational charts, category trees, network paths) by defining a CTE that references itself, typically involving an anchor query and a recursive query joined by `UNION ALL`.
*   **Why you use it:** To traverse and process data with parent-child or node-edge relationships within a single query, avoiding complex loops or multiple queries.
*   **Note:** The `RECURSIVE` keyword requirement and syntax details may vary between database systems.
    ```sql
    -- Example: Finding all subordinates under a specific manager in an employee hierarchy
    WITH RECURSIVE EmployeeHierarchy AS (
        -- Anchor Member: Start with the top-level manager(s) or a specific employee
        SELECT
            employee_id,
            employee_name,
            manager_id,
            1 AS level -- Start at level 1
        FROM
            your_schema.employees
        WHERE
            manager_id IS NULL -- Example: start from the top (no manager)
            -- OR employee_id = 123 -- Example: start from a specific employee

        UNION ALL

        -- Recursive Member: Join employees to their managers found in the previous step
        SELECT
            e.employee_id,
            e.employee_name,
            e.manager_id,
            eh.level + 1 -- Increment level
        FROM
            your_schema.employees AS e
        INNER JOIN
            EmployeeHierarchy AS eh ON e.manager_id = eh.employee_id
        WHERE
            eh.level < 10 -- Optional: Limit recursion depth to prevent infinite loops
    )
    -- Select from the generated hierarchy
    SELECT
        employee_id,
        employee_name,
        manager_id,
        level
    FROM
        EmployeeHierarchy
    ORDER BY
        level, employee_name;
    ```

---

**2. Pivoting Data (Rows to Columns) using Conditional Aggregation**

*   **What it does:** Transforms data from a "long" format (multiple rows per subject, one attribute per row) to a "wide" format (one row per subject, multiple attributes as columns).
*   **Why you use it:** To create summary reports, cross-tabulations, or prepare data for tools that expect a wide format. Conditional aggregation (`AGG(CASE WHEN...)`) is a portable method for pivoting.
*   **Note:** This method requires knowing the pivot column values beforehand. For dynamic pivot columns, dynamic SQL is often needed.
    ```sql
    -- Example: Pivoting monthly sales into columns for each product
    SELECT
        product_id,
        -- Use MAX or SUM/AVG depending on whether you expect one or multiple values per pivot cell
        MAX(CASE WHEN sales_month = '2024-01' THEN sales_amount ELSE NULL END) AS sales_jan_2024,
        MAX(CASE WHEN sales_month = '2024-02' THEN sales_amount ELSE NULL END) AS sales_feb_2024,
        MAX(CASE WHEN sales_month = '2024-03' THEN sales_amount ELSE NULL END) AS sales_mar_2024
        -- Add more CASE WHEN statements for other months/values you want as columns
    FROM (
        -- Subquery to get monthly sales (replace with your source data)
        SELECT
            product_id,
            -- Format the date to month level (syntax varies: TO_CHAR, DATE_FORMAT, FORMAT)
            -- Example for PostgreSQL/BigQuery:
            TO_CHAR(sales_date, 'YYYY-MM') AS sales_month,
            -- Example for MySQL:
            -- DATE_FORMAT(sales_date, '%Y-%m') AS sales_month,
            -- Example for SQL Server:
            -- FORMAT(sales_date, 'yyyy-MM') AS sales_month,
            sales_amount
        FROM
            your_schema.sales_data
    ) AS MonthlySales
    GROUP BY
        product_id -- Group by the identifiers that should form the rows
    ORDER BY
        product_id;
    ```

---

**3. Unpivoting Data (Columns to Rows) using UNION ALL**

*   **What it does:** Transforms data from a "wide" format (multiple related columns representing attributes) to a "long" format (attribute-value pairs across multiple rows).
*   **Why you use it:** To normalize data structures, simplify certain types of aggregation or filtering, or prepare data for systems that expect an entity-attribute-value (EAV) model.
*   **Note:** The `UNION ALL` method is highly portable. Some databases offer native `UNPIVOT` or `CROSS JOIN LATERAL`/`APPLY` methods which might be more concise but less portable.
    ```sql
    -- Example: Unpivoting quarterly sales columns into rows
    SELECT
        product_id,
        'Q1' AS sales_quarter, -- Literal value indicating the source column
        q1_sales AS sales_amount
    FROM
        your_schema.quarterly_sales_wide
    WHERE q1_sales IS NOT NULL -- Optional: Exclude rows where the value is NULL

    UNION ALL

    SELECT
        product_id,
        'Q2' AS sales_quarter,
        q2_sales AS sales_amount
    FROM
        your_schema.quarterly_sales_wide
    WHERE q2_sales IS NOT NULL

    UNION ALL

    SELECT
        product_id,
        'Q3' AS sales_quarter,
        q3_sales AS sales_amount
    FROM
        your_schema.quarterly_sales_wide
    WHERE q3_sales IS NOT NULL

    UNION ALL

    SELECT
        product_id,
        'Q4' AS sales_quarter,
        q4_sales AS sales_amount
    FROM
        your_schema.quarterly_sales_wide
    WHERE q4_sales IS NOT NULL
    ORDER BY
        product_id, sales_quarter;
    ```

---

**4. Sessionization**

*   **What it does:** Groups sequences of user events (e.g., page views, clicks) into distinct sessions based on user activity and time gaps between events (e.g., > 30 minutes of inactivity starts a new session).
*   **Why you use it:** To analyze user behavior within discrete periods of activity, understand user engagement patterns, and calculate session-based metrics.
*   **Note:** Date/time difference calculation syntax is highly database-specific. Performance requires good indexing on user ID and timestamp columns.
    ```sql
    WITH EventTiming AS (
        -- Calculate time difference from previous event for each user
        SELECT
            event_id,
            user_id,
            event_timestamp,
            LAG(event_timestamp, 1) OVER (PARTITION BY user_id ORDER BY event_timestamp ASC) AS prev_event_timestamp
        FROM
            your_schema.user_events
    ),
    SessionStartFlag AS (
        -- Flag events that start a new session
        SELECT
            event_id,
            user_id,
            event_timestamp,
            prev_event_timestamp,
            -- Calculate difference (syntax varies: DATEDIFF, timestamp subtraction, EXTRACT EPOCH)
            -- PostgreSQL example (difference in minutes):
            EXTRACT(EPOCH FROM (event_timestamp - prev_event_timestamp))/60 AS minutes_since_last_event,
            -- SQL Server example (difference in minutes):
            -- DATEDIFF(minute, prev_event_timestamp, event_timestamp) AS minutes_since_last_event,
            CASE
                WHEN prev_event_timestamp IS NULL -- First event for user
                     -- PostgreSQL example condition:
                     OR (EXTRACT(EPOCH FROM (event_timestamp - prev_event_timestamp))/60) > 30 -- Exceeds 30 min timeout
                     -- SQL Server example condition:
                     -- OR DATEDIFF(minute, prev_event_timestamp, event_timestamp) > 30
                    THEN 1
                ELSE 0
            END AS is_new_session_start
        FROM
            EventTiming
    ),
    SessionAssignment AS (
        -- Assign a unique session ID using a cumulative sum of the start flags
        SELECT
            event_id,
            user_id,
            event_timestamp,
            minutes_since_last_event,
            is_new_session_start,
            -- Cumulative sum of start flags creates a unique ID for each session per user
            SUM(is_new_session_start) OVER (PARTITION BY user_id ORDER BY event_timestamp ASC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS session_sequence
        FROM
            SessionStartFlag
    )
    -- Final Selection (can combine session_sequence with user_id for globally unique ID)
    SELECT
        event_id,
        user_id,
        event_timestamp,
        minutes_since_last_event,
        -- Concatenate for a unique session ID (syntax varies)
        user_id || '_' || session_sequence AS session_id -- PostgreSQL/SQLite concat
        -- CAST(user_id AS VARCHAR) + '_' + CAST(session_sequence AS VARCHAR) AS session_id -- SQL Server concat
    FROM
        SessionAssignment
    ORDER BY
        user_id, event_timestamp;
    ```

---

**5. Cohort Analysis (Retention)**

*   **What it does:** Tracks the behavior (e.g., retention, repeat purchases) of groups (cohorts) of users who share a common characteristic, typically their acquisition date or first action date, over subsequent time periods.
*   **Why you use it:** To understand how user engagement changes over time based on when they were acquired, compare the long-term value of different cohorts, and assess the impact of product changes or marketing campaigns.
*   **Note:** Date truncation and difference calculations are major points of dialect variation.
    ```sql
    WITH UserCohorts AS (
        -- Determine the cohort (e.g., first activity month) for each user
        SELECT
            user_id,
            -- PostgreSQL/BigQuery syntax for first day of month:
            DATE_TRUNC('month', MIN(activity_date)) AS cohort_month
            -- MySQL syntax:
            -- DATE_FORMAT(MIN(activity_date), '%Y-%m-01') AS cohort_month
            -- SQL Server syntax:
            -- DATEFROMPARTS(YEAR(MIN(activity_date)), MONTH(MIN(activity_date)), 1) AS cohort_month
        FROM
            your_schema.user_activity
        GROUP BY
            user_id
    ),
    ActivityWithCohorts AS (
        -- Join activity data with cohort information
        SELECT
            act.user_id,
            act.activity_date,
            cohort.cohort_month,
            -- Calculate period difference (e.g., number of months since cohort start)
            -- This logic varies significantly based on DB date functions!
            -- PostgreSQL example (integer number of months):
            (EXTRACT(YEAR FROM act.activity_date) - EXTRACT(YEAR FROM cohort.cohort_month)) * 12 +
            (EXTRACT(MONTH FROM act.activity_date) - EXTRACT(MONTH FROM cohort.cohort_month)) AS month_number
            -- MySQL example:
            -- TIMESTAMPDIFF(MONTH, cohort.cohort_month, act.activity_date) AS month_number
            -- SQL Server example:
            -- DATEDIFF(MONTH, cohort.cohort_month, act.activity_date) AS month_number
        FROM
            your_schema.user_activity AS act
        JOIN
            UserCohorts AS cohort ON act.user_id = cohort.user_id
    ),
    CohortActivityCounts AS (
         -- Count distinct users active in each cohort during each subsequent month
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
        -- Get the initial size of each cohort (users active in month_number 0)
        SELECT
            cohort_month,
            active_users AS cohort_size
        FROM
            CohortActivityCounts
        WHERE
            month_number = 0
    )
    -- Final Calculation: Retention Percentage
    SELECT
        counts.cohort_month,
        sizes.cohort_size,
        counts.month_number,
        counts.active_users,
        -- Calculate retention rate (ensure floating point division)
        -- PostgreSQL casting:
        (counts.active_users::FLOAT / sizes.cohort_size) * 100.0 AS retention_percentage
        -- SQL Server casting:
        -- (CAST(counts.active_users AS DECIMAL(10,2)) / sizes.cohort_size) * 100.0 AS retention_percentage
        -- Standard SQL casting:
        -- (CAST(counts.active_users AS REAL) / sizes.cohort_size) * 100.0 AS retention_percentage
    FROM
        CohortActivityCounts AS counts
    JOIN
        CohortSizes AS sizes ON counts.cohort_month = sizes.cohort_month
    ORDER BY
        counts.cohort_month,
        counts.month_number;

    ```

---

**6. Querying JSON Data**

*   **What it does:** Extracts values, objects, or array elements from data stored within JSON-formatted columns.
*   **Why you use it:** To work with semi-structured data stored in databases, allowing filtering, aggregation, and reporting based on attributes within the JSON payload without needing to parse it externally.
*   **Note:** Syntax is **extremely** database-specific (`->`, `->>`, `JSON_VALUE`, `JSON_QUERY`, `OPENJSON`, `JSON_EXTRACT`, dot notation). Consult your database documentation.
    ```sql
    -- PostgreSQL jsonb Example:
    SELECT
        id,
        json_data_column ->> 'name' AS user_name, -- ->> extracts as TEXT
        (json_data_column -> 'address' ->> 'city') AS city, -- Navigate nested objects
        (json_data_column -> 'orders' -> 0 ->> 'order_id') AS first_order_id -- Access array element (0-indexed)
    FROM
        your_schema.table_with_json
    WHERE
        -- Filter based on JSON values
        json_data_column ->> 'status' = 'active'
        AND (json_data_column -> 'settings' ->> 'beta_enabled')::BOOLEAN = TRUE; -- Casting needed
        -- Check if a key exists
        -- AND json_data_column ? 'optional_key';
        -- Check if JSON array contains a value
        -- AND json_data_column -> 'tags' @> '["important"]'::jsonb;

    -- --- Other Database Examples (Conceptual) ---
    -- SQL Server Example:
    -- SELECT id, JSON_VALUE(json_data_column, '$.name') AS user_name FROM your_table;
    -- MySQL Example:
    -- SELECT id, JSON_UNQUOTE(JSON_EXTRACT(json_data_column, '$.name')) AS user_name FROM your_table;
    -- Or: SELECT id, json_data_column->>'$.name' AS user_name FROM your_table;
    ```

---

**7. Querying Array Data**

*   **What it does:** Interacts with data stored as arrays or lists within a single database column, allowing expansion of array elements into rows or filtering based on array contents.
*   **Why you use it:** To handle multi-valued attributes stored efficiently in an array structure, enabling joins or filtering based on individual array elements.
*   **Note:** Native array support and syntax vary significantly. Some databases rely on JSON arrays. `UNNEST` is common in PostgreSQL/BigQuery.
    ```sql
    -- PostgreSQL/BigQuery Example: Expand array elements into separate rows
    SELECT
        t.id,
        tag -- Each tag gets its own row
    FROM
        your_schema.table_with_array AS t,
        UNNEST(t.tags_array_column) AS tag; -- tags_array_column is like ['sql', 'python', 'data']
    -- Or using CROSS JOIN LATERAL (PostgreSQL) / CROSS JOIN (BigQuery)
    -- SELECT t.id, tag FROM your_schema.table_with_array t CROSS JOIN UNNEST(t.tags_array_column) AS tag;

    -- Example: Find rows where an array contains a specific element
    SELECT
        id,
        tags_array_column
    FROM
        your_schema.table_with_array
    WHERE
        -- PostgreSQL array contains operator:
        tags_array_column @> ARRAY['python']
        -- BigQuery standard SQL (uses UNNEST in a subquery or specific functions):
        -- EXISTS (SELECT 1 FROM UNNEST(tags_array_column) AS t WHERE t = 'python')
        -- Another BigQuery approach:
        -- 'python' IN UNNEST(tags_array_column)
        ;
    ```

---

**8. Built-in Statistical Functions**

*   **What it does:** Calculates common statistical measures like standard deviation, variance, correlation, or percentiles directly within the SQL query.
*   **Why you use it:** To perform basic statistical analysis on data without exporting it to external tools, useful for summarizing data distributions or relationships.
*   **Note:** Function names (`STDDEV`/`STDEV`, `VARIANCE`/`VAR`), availability, sample vs. population calculations, and percentile syntax (`PERCENTILE_CONT`/`DISC`, `APPROX_QUANTILES`) vary significantly.
    ```sql
    SELECT
        category,
        AVG(value) AS average_value,
        STDDEV_SAMP(value) AS sample_std_dev, -- Sample Standard Deviation (or STDDEV, STDEV)
        VAR_SAMP(value) AS sample_variance, -- Sample Variance (or VARIANCE)
        -- Median using percentile (syntax varies widely)
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY value ASC) AS median_continuous -- Interpolated median (PostgreSQL, SQL Server, Oracle)
        -- PERCENTILE_DISC(0.5) WITHIN GROUP (ORDER BY value ASC) AS median_discrete -- Closest value median
        -- APPROX_QUANTILES(value, 100)[OFFSET(50)] AS approx_median -- BigQuery approximate percentile
    FROM
        your_schema.your_data
    GROUP BY
        category;

    -- Correlation between two columns
    SELECT
        CORR(column_a, column_b) AS correlation_coefficient
    FROM
        your_schema.paired_data;
    ```

---

**Conceptual Mentions (No Snippets - Highly DB Specific):**

*   **Advanced Indexing:** Beyond single-column indexes, consider Multi-Column Indexes, Covering Indexes, and specialized types like Hash, GiST/GIN (PostgreSQL), or Full-Text indexes based on query patterns.
*   **Materialized Views:** Pre-computed, stored query results that speed up access to complex aggregations or joins but require a refresh strategy. Syntax and capabilities vary widely.
*   **Stored Procedures/Functions:** Encapsulating reusable SQL and procedural logic (loops, variables, conditionals) within the database. Syntax is entirely database-specific (PL/pgSQL, T-SQL, PL/SQL, etc.).
