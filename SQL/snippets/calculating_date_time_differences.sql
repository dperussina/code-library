-- ======================================================================
-- SQL Snippet: Calculating Date/Time Differences
-- ======================================================================
-- Purpose: Demonstrates common ways to find the difference between two date/time values.
-- Note: Syntax and available functions vary significantly between database systems.

-- ----------------------------------------------------------------------
-- Method 1: Direct Subtraction (Common for Timestamp/Date Types)
-- ----------------------------------------------------------------------
-- Subtracting two TIMESTAMPS or DATES often yields an INTERVAL type (e.g., PostgreSQL, Oracle).
-- The exact type and format of the INTERVAL depend on the database.
SELECT
    end_timestamp,
    start_timestamp,
    end_timestamp - start_timestamp AS duration_interval -- Result is often an INTERVAL (e.g., '3 days 04:05:06')
FROM
    your_schema.your_table;

-- ----------------------------------------------------------------------
-- Method 2: Using DATEDIFF Function (Common in SQL Server, MySQL)
-- ----------------------------------------------------------------------
-- DATEDIFF calculates the difference based on a specified date part (day, hour, minute, etc.).
-- Syntax Example (SQL Server / MySQL - check specific DB docs):
-- SELECT DATEDIFF(day, start_date, end_date) AS difference_in_days FROM your_table;
-- SELECT DATEDIFF(hour, start_timestamp, end_timestamp) AS difference_in_hours FROM your_table;

-- ----------------------------------------------------------------------
-- Method 3: Using EXTRACT EPOCH (PostgreSQL)
-- ----------------------------------------------------------------------
-- Calculate the difference as an interval, then extract the total number of seconds (epoch).
-- This provides the duration as a single number (total seconds), which can be easier to work with.
SELECT
    end_timestamp,
    start_timestamp,
    EXTRACT(EPOCH FROM (end_timestamp - start_timestamp)) AS duration_in_seconds
FROM
    your_schema.your_table; -- PostgreSQL specific

-- ----------------------------------------------------------------------
-- Method 4: Using JULIANDAY (SQLite)
-- ----------------------------------------------------------------------
-- SQLite can calculate differences using the Julian day number.
-- SELECT JULIANDAY(end_date) - JULIANDAY(start_date) AS difference_in_days FROM your_table; -- SQLite specific