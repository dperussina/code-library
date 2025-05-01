#!/bin/bash
set -euo pipefail

DB_NAME="mydatabase"
DB_USER="myuser"
DB_HOST="localhost"
export PGPASSWORD="mypassword"

USER_NAME="Charlie"
USER_EMAIL="charlie@example.com"
ORDER_ID=123
ORDER_AMOUNT=99.99

SQL_COMMANDS=$(cat <<-EOF
BEGIN;
INSERT INTO users (name, email) VALUES ('$USER_NAME', '$USER_EMAIL')
ON CONFLICT (email) DO NOTHING;
INSERT INTO orders (user_email, order_id, amount)
VALUES ('$USER_EMAIL', $ORDER_ID, $ORDER_AMOUNT);
COMMIT;
EOF
)

echo "Executing database transaction..."
psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -v ON_ERROR_STOP=1 -X -q -c "$SQL_COMMANDS"

if [ $? -eq 0 ]; then
    echo "Transaction completed successfully."
else
    echo "ERROR: Database transaction failed. Changes were rolled back." >&2
    exit 1
fi

EXPORT_FILE="users_export.csv"
echo "Exporting users table to CSV..."
psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -X -q \
     -c "\COPY users TO '$EXPORT_FILE' WITH (FORMAT CSV, HEADER);"

if [ $? -eq 0 ]; then
    echo "Data exported successfully to $EXPORT_FILE"
else
    echo "ERROR: Failed to export data." >&2
    exit 1
fi