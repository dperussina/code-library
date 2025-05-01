-- Script for Upsert Pattern (Insert or Update on Conflict)
-- PostgreSQL / SQLite Example
INSERT INTO your_schema.your_table (id, name, value)
VALUES (1, 'Example Name', 100)
ON CONFLICT (id) -- Specify constraint or column(s) that cause conflict
DO UPDATE SET
    name = EXCLUDED.name, -- Use EXCLUDED to refer to values from the proposed INSERT
    value = EXCLUDED.value + your_table.value; -- Can update based on existing value

-- SQL Server / Oracle Example: MERGE Statement
-- MERGE INTO target_table AS T
-- USING source_table AS S
-- ON (T.id = S.id)
-- WHEN MATCHED THEN
--     UPDATE SET T.value = S.value
-- WHEN NOT MATCHED THEN
--     INSERT (id, value) VALUES (S.id, S.value);