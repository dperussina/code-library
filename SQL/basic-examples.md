
It's crucial to remember that **SQL syntax can vary significantly** between different database systems (e.g., PostgreSQL, MySQL, SQL Server, Oracle, SQLite, BigQuery, Snowflake). These snippets aim to use standard ANSI SQL where possible, but you'll often need to adapt them to your specific database dialect, especially for date functions, complex data types, and some advanced features.
Okay, here is a collection of essential SQL query patterns and snippets useful for engineers and data scientists. This "SQL library" focuses on common tasks and analytical patterns.

**Important Considerations:**

* **SQL Dialects:** SQL syntax varies significantly between database systems (PostgreSQL, MySQL, SQL Server, Oracle, SQLite, BigQuery, Snowflake, etc.). These snippets use standard ANSI SQL where possible, but **always verify and adapt the syntax for your specific database system**, especially for date functions, string functions, and advanced features like window functions or CTEs.
* **Readability:** Use consistent formatting (indentation, capitalization) and aliases to make your queries understandable. Use comments (`--`) to explain complex logic.
* **Performance:** Query performance depends heavily on database design, indexing, data volume, and the specific database engine. These snippets focus on logical patterns; optimization often requires analyzing execution plans (`EXPLAIN`) and understanding indexing specific to your system. Avoid `SELECT *` in production queries.

---

**1. Basic Retrieval & Filtering**

* **Selecting Specific Columns with Filtering and Ordering**
    ```sql
    SELECT
        column1,
        column2,
        column3 AS alias_for_column3 -- Use aliases for clarity
    FROM
        your_schema.your_table
    WHERE
        column1 > 100 -- Numeric comparison
        AND column4 = 'some_value' -- String equality (case-sensitivity varies by DB/collation)
        AND column5 IN ('value1', 'value2', 'value3') -- Check membership in a list
        AND date_column BETWEEN '2024-01-01' AND '2024-12-31' -- Date range
        AND text_column LIKE 'prefix%' -- Pattern matching (% = any sequence, _ = single char)
    ORDER BY
        column1 DESC, -- Order by column1 descending
        column2 ASC   -- Then by column2 ascending (ASC is default)
    LIMIT 100; -- Limit the number of rows returned (Syntax varies: FETCH FIRST, TOP)
    ```
    * **Explanation:** Retrieves specific columns, applies multiple filtering conditions using `WHERE` with `AND`, sorts the results using `ORDER BY`, and limits the output rows. `AS` provides meaningful names for columns in the result set.

---

**2. Joining Tables**

* **Inner Join (Matching Rows Only)**
    ```sql
    SELECT
        t1.key_column,
        t1.column_a,
        t2.column_b
    FROM
        your_schema.table1 AS t1 -- Use table aliases for brevity
    INNER JOIN
        your_schema.table2 AS t2
        ON t1.key_column = t2.foreign_key_column; -- Join condition based on related columns
    ```
    * **Explanation:** Combines rows from `table1` and `table2` where the join condition (`ON` clause) is met. Only rows with matching keys in *both* tables are included.

* **Left Join (Keep All Left Rows, Match Right Rows)**
    ```sql
    SELECT
        t1.key_column,
        t1.column_a,
        t2.column_b -- This will be NULL if no match is found in table2
    FROM
        your_schema.table1 AS t1
    LEFT JOIN
        your_schema.table2 AS t2
        ON t1.key_column = t2.foreign_key_column;
    ```
    * **Explanation:** Returns *all* rows from the "left" table (`table1`) and the matched rows from the "right" table (`table2`). If there's no match in `table2` for a row in `table1`, the columns from `table2` will contain `NULL`. (Similarly, `RIGHT JOIN` keeps all from the right, `FULL OUTER JOIN` keeps all from both).

---

**3. Aggregation**

* **Grouping and Aggregating Data**
    ```sql
    SELECT
        category_column,
        COUNT(*) AS number_of_rows, -- Total rows per category
        COUNT(DISTINCT specific_column) AS distinct_items, -- Count unique values in a column
        SUM(value_column) AS total_value,
        AVG(value_column) AS average_value,
        MIN(value_column) AS minimum_value,
        MAX(value_column) AS maximum_value
    FROM
        your_schema.your_table
    WHERE
        -- Optional: Filter rows *before* grouping
        date_column >= '2024-01-01'
    GROUP BY
        category_column -- Group rows with the same value in category_column
    HAVING
        -- Optional: Filter groups *after* aggregation
        COUNT(*) > 10 -- Only show categories with more than 10 rows
        AND SUM(value_column) > 1000; -- And total value > 1000
    ORDER BY
        total_value DESC;
    ```
    * **Explanation:** Groups rows based on `category_column`. Aggregate functions (`COUNT`, `SUM`, `AVG`, `MIN`, `MAX`) calculate summary statistics *for each group*. `WHERE` filters rows before grouping, while `HAVING` filters the *groups* themselves based on the results of aggregate functions.

---

**4. Subqueries and Common Table Expressions (CTEs)**

* **Subquery in WHERE Clause**
    ```sql
    SELECT
        column1,
        column2
    FROM
        your_schema.table1
    WHERE
        key_column IN (SELECT foreign_key_column FROM your_schema.table2 WHERE filter_column = 'active');
    ```
    * **Explanation:** The inner query (`SELECT foreign_key_column...`) runs first, creating a list of keys. The outer query then selects rows from `table1` where `key_column` is present in that list. Subqueries can also appear in `SELECT` and `FROM` clauses.

* **Common Table Expression (CTE)**
    ```sql
    WITH ActiveKeys AS (
        -- Define a temporary, named result set (CTE)
        SELECT foreign_key_column
        FROM your_schema.table2
        WHERE filter_column = 'active'
    ), AnotherCTE AS (
        -- You can define multiple CTEs, separating them by commas
        SELECT some_column
        FROM your_schema.table3
        WHERE value > 50
    )
    -- Main query using the CTE(s)
    SELECT
        t1.column1,
        t1.column2
    FROM
        your_schema.table1 AS t1
    INNER JOIN
        ActiveKeys ak ON t1.key_column = ak.foreign_key_column -- Join with the CTE like a table
    WHERE
        t1.another_column IN (SELECT some_column FROM AnotherCTE); -- Can use CTEs in subqueries too
    ```
    * **Explanation:** CTEs (using the `WITH` clause) break down complex queries into logical, readable steps. They define temporary named result sets that can be referenced like tables within the subsequent main query (or other CTEs defined later in the `WITH` clause). Often improves readability compared to nested subqueries.

---

**5. Window Functions**

* **Ranking Within Partitions**
    ```sql
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
    ```
    * **Explanation:** Window functions perform calculations across a set of rows related to the current row (the "window"). `PARTITION BY` divides the rows into groups (like `GROUP BY`, but doesn't collapse rows). `ORDER BY` defines the order *within* each partition for the function. `ROW_NUMBER`, `RANK`, `DENSE_RANK` assign ranks based on this order.

* **Lag/Lead (Accessing Previous/Next Rows)**
    ```sql
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
    ```
    * **Explanation:** `LAG` accesses data from a previous row, and `LEAD` accesses data from a following row within the defined window partition and order. Useful for calculating differences over time or sequences.

* **Running Aggregates**
    ```sql
    SELECT
        order_date,
        category,
        daily_sales,
        -- Calculate cumulative sales for each category up to the current date
        SUM(daily_sales) OVER (PARTITION BY category ORDER BY order_date ASC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total_sales,
         -- Calculate 7-day moving average sales for each category
        AVG(daily_sales) OVER (PARTITION BY category ORDER BY order_date ASC ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS moving_avg_7day_sales
    FROM
        your_schema.daily_sales_summary;
    ```
    * **Explanation:** Aggregate functions (`SUM`, `AVG`, `COUNT`, etc.) can be used as window functions. `ORDER BY` is crucial. The `ROWS BETWEEN ...` clause (the "frame clause") defines which rows relative to the current row are included in the aggregation (e.g., all preceding rows for a running total, or the last N rows for a moving average). Default frame often depends on `ORDER BY`.

---

**6. Conditional Logic**

* **CASE WHEN Statement**
    ```sql
    SELECT
        item_id,
        value,
        -- Create a new column based on conditions
        CASE
            WHEN value > 1000 THEN 'High'
            WHEN value > 500 AND value <= 1000 THEN 'Medium' -- Conditions evaluated in order
            WHEN value > 0 THEN 'Low'
            ELSE 'Zero or Negative' -- Optional default case
        END AS value_category,
        -- Use CASE inside an aggregate function (Conditional Aggregation)
        SUM(CASE WHEN status = 'Completed' THEN amount ELSE 0 END) AS completed_amount_sum,
        COUNT(CASE WHEN type = 'Urgent' THEN 1 END) AS urgent_item_count -- COUNT ignores NULLs, so no ELSE needed
    FROM
        your_schema.your_table
    GROUP BY -- Required if using conditional aggregation without window functions
         item_id, value, value_category -- Group by non-aggregated columns
         ;
    ```
    * **Explanation:** `CASE` provides if/then/else logic within a query. It evaluates conditions sequentially and returns the result associated with the first true condition. Can be used to create categories or perform conditional aggregations.

---

**7. Date/Time Manipulation (Conceptual - Syntax Varies Widely!)**

* **Extracting Date/Time Components**
    ```sql
    -- Standard SQL (often supported)
    SELECT EXTRACT(YEAR FROM date_column) AS year, EXTRACT(MONTH FROM date_column) AS month FROM your_table;
    -- PostgreSQL Specific
    SELECT DATE_PART('year', date_column) AS year, DATE_PART('dow', date_column) AS day_of_week FROM your_table; -- (0=Sun, 6=Sat)
    -- MySQL Specific
    SELECT YEAR(date_column) AS year, MONTHNAME(date_column) AS month_name FROM your_table;
    -- SQL Server Specific
    SELECT DATEPART(year, date_column) AS year, DATENAME(weekday, date_column) AS weekday_name FROM your_table;
    ```
    * **Explanation:** Used to get specific parts (year, month, day, hour, day of week, etc.) from a date/timestamp. Check your DB documentation for exact function names and parameters (`EXTRACT`, `DATE_PART`, `YEAR`, `MONTH`, `DATEPART`, etc.).

* **Calculating Date/Time Differences**
    ```sql
    -- PostgreSQL / Oracle (using subtraction - result might be an interval type)
    SELECT timestamp_column_end - timestamp_column_start AS duration FROM your_table;
    -- SQL Server / MySQL (specific function)
    SELECT DATEDIFF(day, date_column_start, date_column_end) AS days_difference FROM your_table; -- Unit ('day') varies
    ```
    * **Explanation:** Calculates the duration between two date/time values. Syntax and the units returned (`DATEDIFF` often returns integers, subtraction might return an interval type) vary greatly.

* **Getting Current Date/Time**
    ```sql
    -- Often supported (check specific DB for exact name and return type)
    SELECT CURRENT_DATE; -- Returns date
    SELECT CURRENT_TIMESTAMP; -- Returns date and time with timezone (usually)
    SELECT NOW(); -- Common alternative, behavior varies
    SELECT GETDATE(); -- SQL Server
    ```
    * **Explanation:** Retrieves the date/time when the query is executed according to the database server.

---

**8. String Manipulation (Syntax Varies)**

* **Concatenation**
    ```sql
    -- Standard SQL Concatenation Operator
    SELECT string_col1 || ' ' || string_col2 AS full_string FROM your_table;
    -- Function based (more common across dialects)
    SELECT CONCAT(string_col1, ' ', string_col2) AS full_string FROM your_table;
    ```
* **Substring**
    ```sql
    -- Standard SQL (1-based indexing usually)
    SELECT SUBSTRING(string_column FROM 2 FOR 3) AS sub FROM your_table; -- Start at char 2, get 3 chars
    -- Common Function (indexing/parameters vary)
    SELECT SUBSTR(string_column, 2, 3) AS sub FROM your_table;
    ```
* **Pattern Matching (Basic)** - See Section 1 (`LIKE`)

---

**9. Handling NULLs**

* **Replacing NULLs with a Default Value**
    ```sql
    SELECT
        column1,
        COALESCE(potentially_null_column, 'Default Value') AS column_with_default
    FROM
        your_schema.your_table;
    ```
    * **Explanation:** `COALESCE` returns the first non-NULL value from its arguments. Useful for providing defaults when a column might be NULL.

* **Filtering NULLs**
    ```sql
    SELECT column1 FROM your_schema.your_table WHERE nullable_column IS NULL;
    SELECT column1 FROM your_schema.your_table WHERE nullable_column IS NOT NULL;
    ```

---

**10. Basic Data Definition Language (DDL)**

* **Creating a Simple Table**
    ```sql
    CREATE TABLE IF NOT EXISTS your_schema.new_table (
        id INT PRIMARY KEY, -- Or SERIAL, AUTO_INCREMENT depending on DB
        name VARCHAR(100) NOT NULL, -- Variable length string, cannot be NULL
        email VARCHAR(100) UNIQUE, -- Must be unique across all rows
        value DECIMAL(10, 2), -- Fixed precision decimal
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP -- Timestamp with timezone info
    );
    ```
    * **Explanation:** Defines a new table structure, specifying column names, data types, and constraints (`PRIMARY KEY`, `NOT NULL`, `UNIQUE`, `DEFAULT`). `IF NOT EXISTS` prevents errors if the table already exists. Data types and auto-increment syntax vary.

---

**11. Basic Data Manipulation Language (DML)**

* **Inserting Data**
    ```sql
    -- Insert single row with specified values
    INSERT INTO your_schema.your_table (column1, column2) VALUES ('value1', 123);

    -- Insert results from a SELECT query
    INSERT INTO your_schema.your_table (column1, column2)
    SELECT source_column_a, source_column_b FROM your_schema.source_table WHERE condition;
    ```

* **Updating Data**
    ```sql
    UPDATE your_schema.your_table
    SET
        column1 = 'new_value',
        column2 = column2 + 1 -- Can use existing values
    WHERE
        key_column = 123; -- IMPORTANT: Always use WHERE to avoid updating all rows!
    ```

* **Deleting Data**
    ```sql
    DELETE FROM your_schema.your_table
    WHERE
        date_column < '2020-01-01'; -- IMPORTANT: Always use WHERE to avoid deleting all rows!
    ```

* **Upsert Pattern (Conceptual - Syntax Varies Greatly)**
    ```sql
    -- PostgreSQL / SQLite Example: Insert or Update on Conflict
    INSERT INTO your_schema.your_table (id, name, value)
    VALUES (1, 'Example Name', 100)
    ON CONFLICT (id) -- Specify constraint or column(s) that cause conflict
    DO UPDATE SET
        name = EXCLUDED.name, -- Use EXCLUDED to refer to values from the proposed INSERT
        value = EXCLUDED.value + your_table.value; -- Can update based on existing value

    -- SQL Server / Oracle Example: MERGE Statement (more complex syntax)
    -- MERGE INTO target_table AS T
    -- USING source_table AS S
    -- ON (T.id = S.id)
    -- WHEN MATCHED THEN
    --     UPDATE SET T.value = S.value
    -- WHEN NOT MATCHED THEN
    --     INSERT (id, value) VALUES (S.id, S.value);
    ```
    * **Explanation:** An "Upsert" operation attempts to INSERT a row. If it would violate a unique constraint (like a primary key or unique index), it performs an UPDATE instead. Syntax is highly database-specific (`ON CONFLICT`, `MERGE`).
