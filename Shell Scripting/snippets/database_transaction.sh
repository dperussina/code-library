#!/bin/bash
# Enable strict mode.
set -euo pipefail

# --- Database Configuration ---
# Replace with your actual database credentials and details.
DB_NAME="mydatabase"
DB_USER="myuser"
DB_HOST="localhost"
# WARNING: Storing passwords directly in scripts is insecure.
# Consider using .pgpass file, environment variables set externally,
# or other secure methods for production environments.
export PGPASSWORD="mypassword"

# --- Data for Transaction ---
# Example data to be inserted.
USER_NAME="Charlie"
USER_EMAIL="charlie@example.com"
ORDER_ID=123
ORDER_AMOUNT=99.99

# --- Construct SQL Commands ---
# Use a Here Document (<<-EOF) to define multi-line SQL commands.
# The <<- variant removes leading tabs (not spaces) from the here-doc body,
# allowing for indentation in the script.
SQL_COMMANDS=$(cat <<-EOF
BEGIN;

-- Insert user if email doesn't exist. Avoids error if user already exists.
INSERT INTO users (name, email) VALUES ('$USER_NAME', '$USER_EMAIL')
ON CONFLICT (email) DO NOTHING;

-- Insert order details, linking to the user by email.
INSERT INTO orders (user_email, order_id, amount)
VALUES ('$USER_EMAIL', $ORDER_ID, $ORDER_AMOUNT);

-- Commit the transaction if both inserts were successful.
COMMIT;
EOF
)
# Note: Proper SQL injection prevention is crucial in real applications.
# Using prepared statements or parameterized queries via application code
# is generally safer than embedding shell variables directly into SQL strings.

# --- Execute Transaction ---
echo "Executing database transaction..."
# Use psql command-line utility to connect and execute SQL.
# -h: Hostname.
# -U: Username.
# -d: Database name.
# -v ON_ERROR_STOP=1: Stop execution immediately if any SQL command fails within the script.
#                   This ensures that COMMIT is not reached if an INSERT fails, effectively rolling back.
# -X: Do not read the psqlrc startup file.
# -q: Quiet mode (suppress informational messages).
# -c "$SQL_COMMANDS": Execute the SQL commands defined above.
psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -v ON_ERROR_STOP=1 -X -q -c "$SQL_COMMANDS"

# Check the exit status of the psql command.
# `$?` holds the exit status of the last executed command.
if [ $? -eq 0 ]; then
    echo "Transaction completed successfully."
else
    # psql exits with non-zero status if ON_ERROR_STOP is set and an error occurs.
    # The transaction is automatically rolled back in PostgreSQL in case of error within BEGIN/COMMIT block.
    echo "ERROR: Database transaction failed. Changes were rolled back automatically." >&2
    exit 1 # Exit script with an error code.
fi

# --- Example: Data Export (Post-Transaction) ---
EXPORT_FILE="users_export.csv"
echo "\nExporting users table to CSV ($EXPORT_FILE)..."
# Use psql's \copy meta-command for efficient server-side file export.
# Note: The database server process needs write permission to the location of EXPORT_FILE.
# For client-side copy, use `\copy ... TO STDOUT` and redirect `psql ... > file.csv`.
# Ensure the 'users' table exists.
psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -X -q \
     -c "\copy users TO '$EXPORT_FILE' WITH (FORMAT CSV, HEADER);"

if [ $? -eq 0 ]; then
    echo "Data exported successfully to $EXPORT_FILE"
    # Optional: You might want to remove the export file after use.
    # rm "$EXPORT_FILE"
else
    echo "ERROR: Failed to export data." >&2
    # Decide if this failure should halt the script.
    # exit 1
fi

echo "\nDatabase interaction script finished."
exit 0