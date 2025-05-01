-- Script for Stored Procedures/Functions
-- Example: Stored Procedure to Insert a New Order
CREATE OR REPLACE PROCEDURE your_schema.insert_order(
    customer_id INT,
    product_id INT,
    quantity INT,
    order_date DATE
)
LANGUAGE plpgsql AS $$
BEGIN
    INSERT INTO your_schema.orders (customer_id, product_id, quantity, order_date)
    VALUES (customer_id, product_id, quantity, order_date);
END;
$$;

-- Example: Function to Calculate Total Sales for a Product
CREATE OR REPLACE FUNCTION your_schema.calculate_total_sales(product_id INT)
RETURNS NUMERIC AS $$
DECLARE
    total_sales NUMERIC;
BEGIN
    SELECT SUM(sales_amount) INTO total_sales
    FROM your_schema.sales
    WHERE product_id = product_id;
    RETURN total_sales;
END;
$$ LANGUAGE plpgsql;