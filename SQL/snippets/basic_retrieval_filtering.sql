-- Script for Basic Retrieval & Filtering
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