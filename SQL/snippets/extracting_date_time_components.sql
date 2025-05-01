-- ======================================================================
-- SQL Snippet: Extracting Date/Time Components
-- ======================================================================
-- Purpose: Demonstrates how to extract specific parts (year, month, day, hour, etc.)
--          from DATE or TIMESTAMP columns using the EXTRACT function.
-- Note: While EXTRACT is standard SQL, some databases might offer alternative/additional functions (e.g., YEAR(), MONTH()).

SELECT
    date_column, -- Assuming this is a DATE or TIMESTAMP column
    
    -- EXTRACT(part FROM source): Extracts the specified part from the date/timestamp.
    EXTRACT(YEAR FROM date_column) AS year,
    EXTRACT(MONTH FROM date_column) AS month,
    EXTRACT(DAY FROM date_column) AS day,
    EXTRACT(HOUR FROM date_column) AS hour, -- Applicable to TIMESTAMP
    EXTRACT(MINUTE FROM date_column) AS minute, -- Applicable to TIMESTAMP
    EXTRACT(SECOND FROM date_column) AS second, -- Applicable to TIMESTAMP
    EXTRACT(DOW FROM date_column) AS day_of_week, -- Day of the week (e.g., 0=Sunday, 6=Saturday - check DB docs for numbering)
    EXTRACT(DOY FROM date_column) AS day_of_year, -- Day of the year (1-366)
    EXTRACT(WEEK FROM date_column) AS week_of_year -- Week number (ISO 8601 or other standard - check DB docs)
    -- EXTRACT(EPOCH FROM date_column) AS epoch_seconds -- Seconds since 1970-01-01 00:00:00 UTC (PostgreSQL specific)
    -- EXTRACT(QUARTER FROM date_column) AS quarter -- Quarter of the year (1-4)

FROM
    your_schema.your_table; -- Replace with your table name