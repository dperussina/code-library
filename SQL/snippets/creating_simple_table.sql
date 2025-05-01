-- Script for Creating a Simple Table
CREATE TABLE IF NOT EXISTS your_schema.new_table (
    id INT PRIMARY KEY, -- Or SERIAL, AUTO_INCREMENT depending on DB
    name VARCHAR(100) NOT NULL, -- Variable length string, cannot be NULL
    email VARCHAR(100) UNIQUE, -- Must be unique across all rows
    value DECIMAL(10, 2), -- Fixed precision decimal
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP -- Timestamp with timezone info
);