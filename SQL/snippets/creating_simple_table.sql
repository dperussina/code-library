-- ======================================================================
-- SQL Snippet: Creating a Simple Table
-- ======================================================================
-- Purpose: Demonstrates the basic syntax for creating a new table with
--          common data types and constraints.
-- Replace 'your_schema' and table/column names with actual names.

-- CREATE TABLE: Keyword to start table creation.
-- IF NOT EXISTS: Optional clause that prevents an error if the table already exists.
CREATE TABLE IF NOT EXISTS your_schema.new_table (
    -- Column Definitions: name data_type [constraints...]
    
    -- id: An integer column, designated as the PRIMARY KEY.
    -- PRIMARY KEY: Ensures uniqueness and usually creates an index. Often auto-incrementing.
    id INT PRIMARY KEY, -- Common alternatives: SERIAL (PostgreSQL), INT AUTO_INCREMENT (MySQL)
    
    -- name: A variable-length string column with a max length of 100 characters.
    -- NOT NULL: Constraint ensuring this column cannot contain NULL values.
    name VARCHAR(100) NOT NULL, 
    
    -- email: A variable-length string, max 100 chars.
    -- UNIQUE: Constraint ensuring all values in this column are unique across the table (allows one NULL by default in most DBs).
    email VARCHAR(100) UNIQUE,
    
    -- value: A fixed-point decimal number.
    -- DECIMAL(precision, scale): 'precision' is total digits, 'scale' is digits after the decimal.
    -- Good for currency or exact values.
    value DECIMAL(10, 2), 
    
    -- created_at: A timestamp column that includes timezone information.
    -- DEFAULT CURRENT_TIMESTAMP: Automatically sets the column to the current timestamp when a row is inserted if no value is provided.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP 
);

-- Notes:
-- * Data types (INT, VARCHAR, DECIMAL, TIMESTAMP, etc.) can vary between database systems.
-- * Constraint syntax (PRIMARY KEY, NOT NULL, UNIQUE, FOREIGN KEY, CHECK) is generally standard but check specific DB docs.
-- * Choose appropriate data types and constraints based on the data requirements.