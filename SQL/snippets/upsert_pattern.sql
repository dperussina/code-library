-- ======================================================================
-- SQL Snippet: Upsert Pattern (INSERT or UPDATE)
-- ======================================================================
-- Purpose: Demonstrates common patterns for inserting a new row or updating
--          an existing row if a conflict (e.g., duplicate primary key) occurs.
-- Note: Syntax varies significantly between database systems.

-- ----------------------------------------------------------------------
-- Method 1: INSERT ... ON CONFLICT DO UPDATE (PostgreSQL >= 9.5, SQLite >= 3.24)
-- ----------------------------------------------------------------------
INSERT INTO your_schema.your_table (id, name, value)
VALUES (1, 'Example Name', 100) -- Values for the row to be inserted/updated
ON CONFLICT (id) -- Specify the column(s) or constraint name that would cause a conflict (e.g., primary key, unique index).
DO UPDATE SET
    -- Define what columns to update if a conflict occurs.
    name = EXCLUDED.name, -- EXCLUDED refers to the values proposed for insertion (from the VALUES clause).
    value = EXCLUDED.value + your_table.value, -- Can reference the existing row's values (your_table.value).
    last_updated = CURRENT_TIMESTAMP;

-- ----------------------------------------------------------------------
-- Method 2: MERGE Statement (SQL Server, Oracle, DB2 - Standard SQL:2003)
-- ----------------------------------------------------------------------
-- MERGE provides a more verbose but powerful way to handle conditional inserts, updates, or deletes.
/* -- Example MERGE syntax (conceptual - specific syntax varies) --
MERGE INTO your_schema.target_table AS T -- The table to modify
USING (SELECT 1 AS id, 'Source Name' AS name, 50 AS value) AS S -- The source data (can be a subquery, VALUES list, etc.)
ON (T.id = S.id) -- The condition to match rows between target and source
WHEN MATCHED THEN -- Action if a row in Target matches a row in Source based on ON condition
    UPDATE SET 
        T.name = S.name, 
        T.value = T.value + S.value,
        T.last_updated = CURRENT_TIMESTAMP
WHEN NOT MATCHED BY TARGET THEN -- Action if a row exists in Source but not in Target
    INSERT (id, name, value, created_at)
    VALUES (S.id, S.name, S.value, CURRENT_TIMESTAMP);
-- WHEN NOT MATCHED BY SOURCE THEN -- Optional: Action if row exists in Target but not Source (e.g., DELETE)
--    DELETE; 
*/