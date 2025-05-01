-- ======================================================================
-- SQL Snippet: Stored Procedures and Functions (PostgreSQL Example)
-- ======================================================================
-- Purpose: Demonstrates basic creation syntax for stored procedures and functions.
-- Note: Syntax for definition, language, parameters, and body varies significantly across databases.
--       This uses PostgreSQL's PL/pgSQL language.

-- ----------------------------------------------------------------------
-- Stored Procedure Example: Insert a New Order
-- ----------------------------------------------------------------------
-- Procedures are typically used for performing actions (like DML) rather than returning values.
CREATE OR REPLACE PROCEDURE your_schema.insert_order(
    -- Define input parameters with their data types.
    p_customer_id INT,
    p_product_id INT,
    p_quantity INT,
    p_order_date DATE -- Using p_ prefix for parameters is a common convention
)
LANGUAGE plpgsql -- Specify the procedural language used in the body.
AS $$
-- $$ marks the beginning and end of the procedure body (dollar quoting).
BEGIN
    -- SQL statements to execute within the procedure.
    INSERT INTO your_schema.orders (customer_id, product_id, quantity, order_date)
    VALUES (p_customer_id, p_product_id, p_quantity, p_order_date); 
    -- Procedures typically don't RETURN values (though some DBs allow OUT parameters).
END;
$$;
-- Example Call: CALL your_schema.insert_order(101, 505, 2, CURRENT_DATE);

-- ----------------------------------------------------------------------
-- Function Example: Calculate Total Sales for a Product
-- ----------------------------------------------------------------------
-- Functions are typically used for calculations and are expected to RETURN a value.
CREATE OR REPLACE FUNCTION your_schema.calculate_total_sales(p_product_id INT)
RETURNS NUMERIC -- Specify the data type of the value the function will return.
LANGUAGE plpgsql
AS $$
DECLARE
    -- Declare local variables used within the function.
    v_total_sales NUMERIC := 0; -- Initialize variable
BEGIN
    -- Perform calculation and store the result in the local variable.
    -- Note the use of INTO to assign the result of the SELECT to the variable.
    SELECT SUM(sales_amount) INTO v_total_sales
    FROM your_schema.sales
    WHERE product_id = p_product_id; -- Filter by the input parameter
    
    -- Return the calculated value.
    RETURN COALESCE(v_total_sales, 0); -- Return 0 if no sales found (SUM returns NULL)
END;
$$;
-- Example Call: SELECT your_schema.calculate_total_sales(505);