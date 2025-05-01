-- ======================================================================
-- SQL Snippet: Getting Current Date and Time
-- ======================================================================
-- Purpose: Shows various standard and database-specific functions to retrieve
--          the current date and/or timestamp at the time of query execution.

-- Standard SQL Functions (Widely Supported):
SELECT CURRENT_DATE AS current_date_val;         -- Returns the current date (no time component).
SELECT CURRENT_TIMESTAMP AS current_timestamp_val; -- Returns the current date and time, typically with timezone information.
                                                  -- Precision and timezone handling may vary.

-- Common Database-Specific Alternatives:
SELECT NOW() AS now_func; -- Common in PostgreSQL, MySQL. Behavior (timestamp vs timestamp with timezone) can vary.
-- SELECT GETDATE() AS getdate_func; -- Specific to SQL Server. Returns current timestamp.
-- SELECT SYSDATE AS sysdate_val; -- Common in Oracle. Returns current date and time on the DB server.
-- SELECT SYSTIMESTAMP AS systimestamp_val; -- Common in Oracle. Returns timestamp with fractional seconds and timezone.

-- Note: The exact function name, return type (DATE, TIMESTAMP, TIMESTAMP WITH TIME ZONE), 
--       and precision depend heavily on the specific database system being used.
--       Always consult your database documentation.