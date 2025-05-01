-- Script for Getting Current Date/Time
SELECT CURRENT_DATE AS current_date; -- Returns the current date
SELECT CURRENT_TIMESTAMP AS current_timestamp; -- Returns the current date and time with timezone
SELECT NOW() AS now; -- Common alternative, behavior varies by database
SELECT GETDATE() AS get_date; -- SQL Server specific