# SQL Code Snippets Library: Basic Examples

This document provides essential SQL query patterns and snippets useful for engineers and data scientists, focusing on common tasks and analytical patterns.

**Important Considerations:**

*   **SQL Dialects:** SQL syntax varies significantly between database systems (PostgreSQL, MySQL, SQL Server, Oracle, SQLite, BigQuery, Snowflake, etc.). These snippets use standard ANSI SQL where possible, but **always verify and adapt the syntax for your specific database system**, especially for date functions, string functions, and advanced features like window functions or CTEs.
*   **Readability:** Use consistent formatting (indentation, capitalization) and aliases to make your queries understandable. Use comments (`--`) to explain complex logic.
*   **Performance:** Query performance depends heavily on database design, indexing, data volume, and the specific database engine. These snippets focus on logical patterns; optimization often requires analyzing execution plans (`EXPLAIN`) and understanding indexing specific to your system. Avoid `SELECT *` in production queries.

---

**1. Basic Retrieval & Filtering**

*   **Selecting Specific Columns with Filtering and Ordering**
    *   **What it does:** Retrieves specific columns from a table, filters rows based on multiple conditions, sorts the results, and limits the number of rows returned.
    *   **Why you use it:** Fundamental query structure for fetching precisely the data you need, ordered for analysis or display, and limiting results for performance or pagination.
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

---

**2. Joining Tables**

*   **Inner Join (Matching Rows Only)**
    *   **What it does:** Combines rows from two tables based on a matching condition in specified columns.
    *   **Why you use it:** To retrieve related data residing in different tables (e.g., user information and their orders) where a link exists between them. Only includes rows that have a match in both tables.
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

*   **Left Join (Keep All Left Rows, Match Right Rows)**
    *   **What it does:** Combines rows from two tables, returning *all* rows from the first (left) table and matching rows from the second (right) table. If no match exists in the right table, columns from the right table will be `NULL`.
    *   **Why you use it:** To retrieve related data while ensuring all records from the primary table are included, even if they don't have corresponding entries in the secondary table (e.g., listing all users and their orders, including users with no orders).
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

---

**3. Aggregation**

*   **Grouping and Aggregating Data**
    *   **What it does:** Groups rows that have the same values in specified columns and calculates summary statistics (like count, sum, average, min, max) for each group.
    *   **Why you use it:** To summarize data, analyze distributions, and generate reports based on categories (e.g., calculating total sales per product category, counting users per country).
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

---

**4. Subqueries and Common Table Expressions (CTEs)**

*   **Subquery in WHERE Clause**
    *   **What it does:** Uses the result set of an inner query (subquery) to filter the results of an outer query.
    *   **Why you use it:** To apply filtering conditions based on data in another table or a derived result set without performing an explicit join, often used with operators like `IN`, `NOT IN`, `EXISTS`, `NOT EXISTS`, or comparison operators.
    ```sql
    SELECT
        column1,
        column2
    FROM
        your_schema.table1
    WHERE
        key_column IN (SELECT foreign_key_column FROM your_schema.table2 WHERE filter_column = 'active');
    ```

*   **Common Table Expression (CTE)**
    *   **What it does:** Defines one or more temporary, named result sets using the `WITH` clause, which can then be referenced like regular tables within the main query.
    *   **Why you use it:** To break down complex queries into smaller, more manageable, and readable logical units. Avoids repeating subqueries and often improves query organization compared to deeply nested subqueries.
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

---

**5. Window Functions**

*   **Ranking Within Partitions**
    *   **What it does:** Assigns a rank (`ROW_NUMBER`, `RANK`, `DENSE_RANK`) to each row within a partition (group) based on a specified order, without collapsing the rows.
    *   **Why you use it:** To determine the rank or position of rows within specific categories (e.g., ranking products by sales within each category, finding the top N items per group).
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

*   **Lag/Lead (Accessing Previous/Next Rows)**
    *   **What it does:** Accesses data from a previous row (`LAG`) or a subsequent row (`LEAD`) within the same partition, based on a specified order.
    *   **Why you use it:** To compare values between consecutive rows within a group, often used for calculating differences over time, identifying sequences, or comparing against prior/next states.
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

*   **Running Aggregates**
    *   **What it does:** Calculates cumulative aggregates (like `SUM`, `AVG`, `COUNT`) over a window of rows relative to the current row, typically defined by partitioning and ordering.
    *   **Why you use it:** To compute running totals, moving averages, or other cumulative metrics over ordered data (e.g., calculating cumulative sales month-to-date, computing a 7-day rolling average of website visits).
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

---

**6. Conditional Logic**

*   **CASE WHEN Statement**
    *   **What it does:** Implements if/then/else logic within a SQL query, allowing different values to be returned based on evaluated conditions.
    *   **Why you use it:** To create derived columns based on conditional rules (e.g., categorizing values), or to perform conditional aggregation (e.g., summing values only when a certain status is met).
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

---

**7. Date/Time Manipulation (Conceptual - Syntax Varies Widely!)**

*   **Extracting Date/Time Components**
    *   **What it does:** Retrieves specific parts (year, month, day, hour, etc.) from a date or timestamp value.
    *   **Why you use it:** Essential for filtering, grouping, or reporting based on specific time periods (e.g., aggregating sales by month, filtering records from a specific year).
    *   **Note:** Syntax varies widely (`EXTRACT`, `DATE_PART`, `YEAR`, `MONTH`, etc.). Check your DB documentation.
    ```sql
    -- Standard SQL (often supported)
    SELECT EXTRACT(YEAR FROM date_column) AS year, EXTRACT(MONTH FROM date_column) AS month FROM your_table;
    -- PostgreSQL Specific
    -- SELECT DATE_PART('year', date_column) AS year, DATE_PART('dow', date_column) AS day_of_week FROM your_table; -- (0=Sun, 6=Sat)
    -- MySQL Specific
    -- SELECT YEAR(date_column) AS year, MONTHNAME(date_column) AS month_name FROM your_table;
    -- SQL Server Specific
    -- SELECT DATEPART(year, date_column) AS year, DATENAME(weekday, date_column) AS weekday_name FROM your_table;
    ```

*   **Calculating Date/Time Differences**
    *   **What it does:** Computes the duration or difference between two date/time values.
    *   **Why you use it:** To measure time intervals, calculate ages, or determine durations between events.
    *   **Note:** Syntax and the type/unit of the result vary widely (`DATEDIFF`, subtraction, interval types). Check your DB documentation.
    ```sql
    -- PostgreSQL / Oracle (using subtraction - result might be an interval type)
    -- SELECT timestamp_column_end - timestamp_column_start AS duration FROM your_table;
    -- SQL Server / MySQL (specific function)
    -- SELECT DATEDIFF(day, date_column_start, date_column_end) AS days_difference FROM your_table; -- Unit ('day') varies
    ```

*   **Getting Current Date/Time**
    *   **What it does:** Retrieves the current date and/or time from the database server when the query executes.
    *   **Why you use it:** To timestamp records, filter based on the current time, or use the current date in calculations.
    *   **Note:** Function names (`CURRENT_DATE`, `CURRENT_TIMESTAMP`, `NOW()`, `GETDATE()`) and return types vary. Check your DB documentation.
    ```sql
    -- Often supported (check specific DB for exact name and return type)
    SELECT CURRENT_DATE; -- Returns date
    SELECT CURRENT_TIMESTAMP; -- Returns date and time with timezone (usually)
    -- SELECT NOW(); -- Common alternative, behavior varies
    -- SELECT GETDATE(); -- SQL Server
    ```

---

**8. String Manipulation (Syntax Varies)**

*   **Concatenation**
    *   **What it does:** Combines two or more strings into a single string.
    *   **Why you use it:** To create composite strings, format output, or build descriptive labels.
    *   **Note:** Use the standard `||` operator or the `CONCAT` function (more portable).
    ```sql
    -- Standard SQL Concatenation Operator
    SELECT string_col1 || ' ' || string_col2 AS full_string FROM your_table;
    -- Function based (more common across dialects)
    -- SELECT CONCAT(string_col1, ' ', string_col2) AS full_string FROM your_table;
    ```
*   **Substring**
    *   **What it does:** Extracts a portion of a string based on starting position and length.
    *   **Why you use it:** To parse parts of strings, extract codes or identifiers, or shorten long text fields.
    *   **Note:** Function name (`SUBSTRING`, `SUBSTR`) and indexing (1-based vs 0-based) vary. Check your DB documentation.
    ```sql
    -- Standard SQL (1-based indexing usually)
    SELECT SUBSTRING(string_column FROM 2 FOR 3) AS sub FROM your_table; -- Start at char 2, get 3 chars
    -- Common Function (indexing/parameters vary)
    -- SELECT SUBSTR(string_column, 2, 3) AS sub FROM your_table;
    ```

---

**9. Handling NULLs**

*   **Replacing NULLs with a Default Value**
    *   **What it does:** Returns the first non-NULL value from a list of arguments.
    *   **Why you use it:** To provide default values for columns that might contain NULLs, preventing NULLs from propagating in calculations or ensuring cleaner output.
    ```sql
    SELECT
        column1,
        COALESCE(potentially_null_column, 'Default Value') AS column_with_default
    FROM
        your_schema.your_table;
    ```

*   **Filtering NULLs**
    *   **What it does:** Selects rows based on whether a specific column contains a NULL value or not.
    *   **Why you use it:** To explicitly include or exclude rows where data is missing in a particular column.
    ```sql
    SELECT column1 FROM your_schema.your_table WHERE nullable_column IS NULL;
    SELECT column1 FROM your_schema.your_table WHERE nullable_column IS NOT NULL;
    ```

---

**10. Basic Data Definition Language (DDL)**

*   **Creating a Simple Table**
    *   **What it does:** Defines the structure (schema) for a new database table, including column names, data types, and constraints.
    *   **Why you use it:** To create the necessary storage structures for your data before inserting or querying it.
    *   **Note:** Syntax for data types (`INT`, `SERIAL`, `AUTO_INCREMENT`, `VARCHAR`, `DECIMAL`, `TIMESTAMP`) and constraints (`PRIMARY KEY`, `NOT NULL`, `UNIQUE`, `DEFAULT`) varies significantly by database system.
    ```sql
    CREATE TABLE IF NOT EXISTS your_schema.new_table (
        id INT PRIMARY KEY, -- Or SERIAL, AUTO_INCREMENT depending on DB
        name VARCHAR(100) NOT NULL, -- Variable length string, cannot be NULL
        email VARCHAR(100) UNIQUE, -- Must be unique across all rows
        value DECIMAL(10, 2), -- Fixed precision decimal
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP -- Timestamp with timezone info
    );
    ```

---

**11. Basic Data Manipulation Language (DML)**

*   **Inserting Data**
    *   **What it does:** Adds new rows into a table.
    *   **Why you use it:** To populate tables with initial data or add new records over time.
    ```sql
    -- Insert single row with specified values
    INSERT INTO your_schema.your_table (column1, column2) VALUES ('value1', 123);

    -- Insert results from a SELECT query
    INSERT INTO your_schema.your_table (column1, column2)
    SELECT source_column_a, source_column_b FROM your_schema.source_table WHERE condition;
    ```

*   **Updating Data**
    *   **What it does:** Modifies existing data in one or more rows of a table.
    *   **Why you use it:** To correct errors, change statuses, or update information in existing records.
    *   **Caution:** Always use a `WHERE` clause unless you intend to update *all* rows in the table.
    ```sql
    UPDATE your_schema.your_table
    SET
        column1 = 'new_value',
        column2 = column2 + 1 -- Can use existing values
    WHERE
        key_column = 123; -- IMPORTANT: Always use WHERE to avoid updating all rows!
    ```

*   **Deleting Data**
    *   **What it does:** Removes rows from a table.
    *   **Why you use it:** To remove obsolete, incorrect, or unwanted records.
    *   **Caution:** Always use a `WHERE` clause unless you intend to delete *all* rows in the table.
    ```sql
    DELETE FROM your_schema.your_table
    WHERE
        date_column < '2020-01-01'; -- IMPORTANT: Always use WHERE to avoid deleting all rows!
    ```

*   **Upsert Pattern (Conceptual - Syntax Varies Greatly)**
    *   **What it does:** Attempts to insert a new row; if a conflict (typically a unique constraint violation) occurs, it updates the existing conflicting row instead.
    *   **Why you use it:** To add new records or update existing ones in a single atomic operation, simplifying logic for maintaining data based on a primary or unique key.
    *   **Note:** Syntax is highly database-specific (`ON CONFLICT`, `MERGE`). Check your DB documentation.
    ```sql
    -- PostgreSQL / SQLite Example: Insert or Update on Conflict
    -- INSERT INTO your_schema.your_table (id, name, value)
    -- VALUES (1, 'Example Name', 100)
    -- ON CONFLICT (id) -- Specify constraint or column(s) that cause conflict
    -- DO UPDATE SET
    --     name = EXCLUDED.name, -- Use EXCLUDED to refer to values from the proposed INSERT
    --     value = EXCLUDED.value + your_table.value; -- Can update based on existing value

    -- SQL Server / Oracle Example: MERGE Statement (more complex syntax)
    -- MERGE INTO target_table AS T
    -- USING source_table AS S
    -- ON (T.id = S.id)
    -- WHEN MATCHED THEN
    --     UPDATE SET T.value = S.value
    -- WHEN NOT MATCHED THEN
    --     INSERT (id, value) VALUES (S.id, S.value);
    ```
