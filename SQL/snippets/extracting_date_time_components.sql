-- Script for Extracting Date/Time Components
SELECT
    EXTRACT(YEAR FROM date_column) AS year,
    EXTRACT(MONTH FROM date_column) AS month
FROM
    your_table;