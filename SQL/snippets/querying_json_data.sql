-- Script for Querying JSON Data
SELECT
    id,
    json_data_column ->> 'name' AS user_name,
    (json_data_column -> 'address' ->> 'city') AS city,
    (json_data_column -> 'orders' -> 0 ->> 'order_id') AS first_order_id
FROM
    your_schema.table_with_json
WHERE
    json_data_column ->> 'status' = 'active'
    AND (json_data_column -> 'settings' ->> 'beta_enabled')::BOOLEAN = TRUE;