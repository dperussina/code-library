# Shell Scripting Code Snippets Library: Advanced Examples

This document covers more advanced shell scripting techniques involving concurrency, database interactions, cloud automation, file locking, and more complex shell features.

**Reminder:** These snippets increasingly rely on specific tools (like `parallel`, `psql`, cloud CLIs, `jq`, `flock`) being installed and configured, or specific `bash` versions. Always verify requirements and adapt syntax. For complex tasks, consider if a language like Python might offer better readability and maintainability.

---

**1. Advanced GNU Parallel Usage (Input Sources, Output Grouping)**

*   **What it does:** Executes jobs in parallel using inputs from multiple sources (files or arguments) or groups output based on the input source.
*   **Why you use it:** Useful for complex parameter sweeps, processing corresponding lines from multiple files simultaneously, or organizing output from parallel jobs based on their input.
*   **Requires:** `parallel` (GNU Parallel - needs installation: `sudo apt install parallel` or `brew install parallel`)
*   **Code (`bash` + `parallel`):**
    ```bash
    #!/bin/bash
    set -euo pipefail

    # Create dummy input files for examples
    echo "A" > params1.txt
    echo "B" >> params1.txt
    echo "C" >> params1.txt
    echo "1" > params2.txt
    echo "2" >> params2.txt
    echo "3" >> params2.txt

    # --- Example 1: Combining inputs from two lists/files ---
    echo "Running command with linked inputs from two files..."
    # parallel --link runs command(param1, param2) for corresponding lines
    # Use ::: to read args directly, :::: to read args from files
    parallel --link echo "Processing {1} with {2}" :::: params1.txt :::: params2.txt
    # Expected Output (order might vary slightly due to parallelism):
    # Processing A with 1
    # Processing B with 2
    # Processing C with 3
    echo "---"

    # --- Example 2: Grouping output based on input ---
    echo "Creating dummy input files..."
    echo "data1" > input_a.txt
    echo "data2" > input_b.txt
    echo "data3" > input_c.txt

    echo "Processing files, grouping output..."
    # {.} gives the input item without extension
    # Runs 'process_script.sh input_x.txt > output_x.log' for each input
    # Assume process_script.sh exists and processes its input file
    # parallel ./process_script.sh {} ">" {.}.log ::: input_*.txt
    # Let's simulate with echo for demonstration:
    parallel echo "Simulating processing of {}" ">" {.}.log ::: input_*.txt
    echo "Check for output_a.log, output_b.log, output_c.log"
    ls output_*.log
    rm input_*.txt output_*.log # Cleanup demo files for this example

    echo "---"

    # --- Example 3: Reading specific columns from a file --- 
    echo "Name,Value1,Value2" > data.csv
    echo "alpha,10,100" >> data.csv
    echo "beta,20,200" >> data.csv

    echo "Processing specific columns from CSV..."
    # --colsep ',' : Use comma as column separator
    # Skips header automatically with --header :
    # parallel --header : --colsep ',' echo "Got Name={1}, Value2={3}" :::: data.csv
    # Manual header skip if needed:
    tail -n +2 data.csv | parallel --colsep ',' echo "Got Name={1}, Value2={3}"
    rm data.csv # Cleanup

    # Cleanup general dummy files
    rm params1.txt params2.txt
    ```

---

**2. Database Interaction with Transactions (Example: `psql`)**

*   **What it does:** Executes multiple SQL commands within a single database transaction from a shell script, ensuring atomicity (all succeed or all fail).
*   **Why you use it:** To guarantee that a series of related database changes are applied together or not at all, maintaining data integrity, especially when automating database modifications.
*   **Requires:** Database command-line client (e.g., `psql` for PostgreSQL, `mysql` for MySQL). Database connection details.
*   **Code (`bash` + `psql`):**
    ```bash
    #!/bin/bash
    set -euo pipefail

    # Database connection details (use environment variables or secure method in production!)
    DB_NAME="mydatabase" 
    DB_USER="myuser"
    DB_HOST="localhost"
    # PGPASSWORD env var often used by psql, or use ~/.pgpass file
    export PGPASSWORD="mypassword"

    # Data to insert
    USER_NAME="Charlie"
    USER_EMAIL="charlie@example.com"
    ORDER_ID=123
    ORDER_AMOUNT=99.99

    # --- Prepare dummy database schema and data (for demonstration) ---
    # Normally you would connect to an existing DB
    echo "Setting up dummy database for demo (dropping existing)..."
    psql -h "$DB_HOST" -U "$DB_USER" -d postgres -v ON_ERROR_STOP=1 -X -q -c "DROP DATABASE IF EXISTS $DB_NAME;"
    psql -h "$DB_HOST" -U "$DB_USER" -d postgres -v ON_ERROR_STOP=1 -X -q -c "CREATE DATABASE $DB_NAME;"
    psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -v ON_ERROR_STOP=1 -X -q <<-EOSQL
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE
        );
        CREATE TABLE orders (
            order_id INTEGER PRIMARY KEY,
            user_email VARCHAR(100),
            amount NUMERIC(10, 2)
        );
EOSQL
    echo "Dummy database setup complete."
    # --- End Dummy Setup ---

    # SQL commands within a single transaction block
    SQL_COMMANDS=$(cat <<-EOF
    BEGIN; -- Start transaction

    -- Insert into users table (use proper quoting/escaping if needed)
    INSERT INTO users (name, email) VALUES ('$USER_NAME', '$USER_EMAIL')
    ON CONFLICT (email) DO NOTHING; -- Example: Handle potential conflicts

    -- Insert into orders table, potentially referencing the user
    -- Note: Getting the generated user ID might require more complex logic
    --       or assuming the ON CONFLICT prevented duplicate insertion if email exists.
    -- This simple example assumes user exists or was just inserted.
    INSERT INTO orders (user_email, order_id, amount)
    VALUES ('$USER_EMAIL', $ORDER_ID, $ORDER_AMOUNT);

    -- Add more commands as needed within the transaction...

    COMMIT; -- Commit transaction if all commands succeeded
    EOF
    )

    echo "Executing database transaction..."
    # psql options:
    # -h: host
    # -U: user
    # -d: database
    # -v ON_ERROR_STOP=1: Abort script if any SQL command fails within psql
    # -X: Do not read startup file (~/.psqlrc)
    # -q: Quiet mode (less verbose output)
    # -c "$SQL_COMMANDS": Execute the command string
    psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -v ON_ERROR_STOP=1 -X -q -c "$SQL_COMMANDS"

    # Check exit status of psql
    if [ $? -eq 0 ]; then
        echo "Transaction completed successfully."
    else
        # psql with ON_ERROR_STOP=1 should have aborted the script due to 'set -e'
        # But we add an explicit check for clarity or if 'set -e' wasn't used.
        echo "ERROR: Database transaction failed. Changes were rolled back." >&2
        exit 1
    fi

    # Example: Exporting data directly to CSV using psql COPY
    echo "Exporting users table to CSV..."
    EXPORT_FILE="users_export.csv"
    psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -X -q \
         -c "\COPY users TO STDOUT WITH (FORMAT CSV, HEADER);" > "$EXPORT_FILE"
         # Changed to STDOUT and redirection for client-side saving

    if [ $? -eq 0 ]; then
        echo "Data exported successfully to $EXPORT_FILE"
        cat "$EXPORT_FILE"
    else
        echo "ERROR: Failed to export data." >&2
        # No transaction rollback needed for \COPY TO (it's usually non-transactional or read-only)
        exit 1
    fi
    rm "$EXPORT_FILE"
    ```

---

**3. Cloud CLI Interaction (Conditional Logic)**

*   **What it does:** Automates cloud infrastructure tasks by checking the state of resources (e.g., if an S3 bucket exists, if a VM is running) and performing actions conditionally based on the results.
*   **Why you use it:** To create idempotent infrastructure scripts (scripts that can be run multiple times with the same result), manage cloud resources reliably, and automate deployment or configuration workflows.
*   **Requires:** Relevant cloud CLI installed and configured (e.g., `aws`, `gcloud`, `az`). Appropriate permissions.
*   **Code (`bash` + AWS CLI Example):**
    ```bash
    #!/bin/bash
    set -euo pipefail

    BUCKET_NAME="my-unique-app-bucket-$(date +%s)"
    REGION="us-west-2"
    TAG_KEY="Project"
    TAG_VALUE="Phoenix"

    echo "Checking if S3 bucket '$BUCKET_NAME' exists..."

    # Attempt to get bucket tagging, suppress errors, check exit code
    if aws s3api get-bucket-tagging --bucket "$BUCKET_NAME" --region "$REGION" > /dev/null 2>&1; then
        echo "Bucket '$BUCKET_NAME' already exists."

        # Example: Check if it has the correct tag
        # Use jq for safer parsing of JSON output
        TAG_JSON=$(aws s3api get-bucket-tagging --bucket "$BUCKET_NAME" --region "$REGION")
        CURRENT_TAG_VALUE=$(echo "$TAG_JSON" | jq -r --arg KEY "$TAG_KEY" '.TagSet[] | select(.Key == $KEY) | .Value // ""')

        if [[ "$CURRENT_TAG_VALUE" == "$TAG_VALUE" ]]; then
            echo "Bucket already has the correct '$TAG_KEY' tag: '$TAG_VALUE'."
        else
            echo "Bucket exists but tag '$TAG_KEY' is '$CURRENT_TAG_VALUE'. Updating..."
            # Construct tagging JSON safely
            TAGGING_JSON=$(jq -n --arg key "$TAG_KEY" --arg value "$TAG_VALUE" \
                           '{ "TagSet": [ { "Key": $key, "Value": $value } ] }')
            aws s3api put-bucket-tagging --bucket "$BUCKET_NAME" --region "$REGION" \
                --tagging "$TAGGING_JSON"
            echo "Tag updated."
        fi
    else
        # Check if the error was specifically "NoSuchBucket" (or similar exit code handling)
        # This is more robust but requires knowing specific errors/codes
        # For simplicity here, we assume any error means it doesn't exist or isn't accessible
        echo "Bucket '$BUCKET_NAME' does not exist or is not accessible. Creating..."
        aws s3api create-bucket --bucket "$BUCKET_NAME" --region "$REGION" \
            --create-bucket-configuration LocationConstraint="$REGION"
        echo "Bucket created. Applying tag..."
        # Construct tagging JSON safely
        TAGGING_JSON=$(jq -n --arg key "$TAG_KEY" --arg value "$TAG_VALUE" \
                       '{ "TagSet": [ { "Key": $key, "Value": $value } ] }')
        aws s3api put-bucket-tagging --bucket "$BUCKET_NAME" --region "$REGION" \
            --tagging "$TAGGING_JSON"
        echo "Tag applied."
    fi

    # --- Cleanup (Optional) ---
    # echo "Cleaning up bucket $BUCKET_NAME..."
    # aws s3api delete-bucket --bucket "$BUCKET_NAME" --region "$REGION"
    # echo "Bucket deleted."
    # --- End Cleanup ---

    echo "Script finished."
    ```

---

**4. File Locking (`flock`)**

*   **What it does:** Prevents multiple instances of a script from running concurrently by using a lock file.
*   **Why you use it:** Crucial for scripts modifying shared resources or those intended as singletons (e.g., cron jobs that should not overlap) to avoid race conditions or duplicated effort.
*   **Requires:** `flock` utility (usually available on Linux).
*   **Code (`bash` + `flock`):**
    ```bash
    #!/bin/bash
    # Note: set -e might cause issues if flock fails immediately, handle carefully.
    set -u
    set -o pipefail

    LOCK_FILE="/var/tmp/my_script.lock.$$" # Use a temporary, unique path initially
    # Or use a fixed path if cleanup is robust:
    # LOCK_FILE="/var/tmp/my_script.lock"

    # Clean up lock file on exit
    trap 'rm -f "$LOCK_FILE"' EXIT

    # -n: Non-blocking - fail immediately if lock cannot be acquired
    # -E <retcode>: Exit code to use if lock fails (optional, default 1)
    # <fd>: File descriptor to use (e.g., 200)
    # The command to run under the lock
    ( 
        flock -n -E 10 200 || { echo "ERROR: $$ Failed to acquire lock. Another instance running?"; exit 10; }
        # --- Critical Section: Only one instance runs this part ---
        echo "Lock acquired ($$). Running critical section..."
        sleep 5 # Simulate work that should not run concurrently
        echo "Critical section finished ($$). Releasing lock."
        # Lock is released automatically when file descriptor 200 is closed (subshell exits)
        # --- End Critical Section ---
    ) 200>"$LOCK_FILE" # Open lock file on descriptor 200, redirect creates/truncates file

    # Check the exit code of the subshell
    FLOCK_EXIT_CODE=$?
    if [ $FLOCK_EXIT_CODE -eq 10 ]; then
      echo "Script could not acquire lock (exit code 10). Exiting gracefully." 
      # Exit 0 here maybe, as it's not an *error* state, just prevented execution
      exit 0 
    elif [ $FLOCK_EXIT_CODE -ne 0 ]; then
      echo "Script failed within the locked section (exit code $FLOCK_EXIT_CODE)." >&2
      exit $FLOCK_EXIT_CODE # Propagate error from critical section
    fi

    echo "Script completed normally ($$)."
    # Note: The lock file ($LOCK_FILE) remains but is empty and unlocked after exit.
    # The trap ensures the file is removed.
    ```

---

**5. Basic Checkpointing/Resuming**

*   **What it does:** Allows a long-running script processing items (e.g., files) to be stopped and resumed later from where it left off by storing the last processed item in a state file.
*   **Why you use it:** To make long batch processes more resilient to interruption. If the script fails or is stopped, it can restart without re-processing everything from the beginning.
*   **Code (`bash`):**
    ```bash
    #!/bin/bash
    set -euo pipefail

    INPUT_DIR="./input_files_checkpoint"
    STATE_FILE="./.process_state_checkpoint"
    PROCESSED_DIR="./processed_files_checkpoint"

    # Setup dummy files for demo
    mkdir -p "$INPUT_DIR" "$PROCESSED_DIR"
    touch "$INPUT_DIR/file_a.dat" "$INPUT_DIR/file_b.dat" "$INPUT_DIR/file_c.dat"
    # touch "$STATE_FILE" # Ensure state file exists
    # Simulate previous run state:
    # echo "file_a.dat" > "$STATE_FILE"

    # Read the last processed file, default to empty string if file is empty/doesn't exist
    LAST_PROCESSED=
    if [ -f "$STATE_FILE" ]; then
        LAST_PROCESSED=$(tail -n 1 "$STATE_FILE")
    fi
    echo "Last processed file according to state: '$LAST_PROCESSED'"

    FOUND_LAST=0
    if [[ -z "$LAST_PROCESSED" ]]; then
      FOUND_LAST=1 # Start from the beginning if state is empty
      echo "No previous state found, starting from beginning."
    fi

    # Use find and sort to get a consistent order
    # Process Substitution avoids issues with loops and subshells modifying variables
    while IFS= read -r -d $'\0' file;
    do
        FILENAME=$(basename "$file")

        # Skip files until we find the last processed one
        if [[ "$FOUND_LAST" -eq 0 ]]; then
            if [[ "$FILENAME" == "$LAST_PROCESSED" ]]; then
                echo "Found last processed file '$FILENAME'. Resuming from next."
                FOUND_LAST=1
            else
                echo "Skipping already processed file '$FILENAME' (before last state)..."
            fi
            continue # Skip to the next file in the loop
        fi

        # --- Process the current file --- 
        echo "Processing '$FILENAME' ($$)..."
        # Simulate processing (replace with actual command)
        cp "$file" "$PROCESSED_DIR/" && sleep 1
        PROCESS_STATUS=$?
        # --- End Processing --- 

        if [[ $PROCESS_STATUS -eq 0 ]]; then
            echo "Successfully processed '$FILENAME'. Updating state."
            # Update state file with the name of the file just processed
            echo "$FILENAME" > "$STATE_FILE"
        else
            echo "ERROR: Failed to process '$FILENAME'. Stopping." >&2
            # Don't update state file on error
            exit 1
        fi
    done < <(find "$INPUT_DIR" -maxdepth 1 -type f -name "*.dat" -print0 | sort -z)
    # Note the < <(...) syntax for Process Substitution feeding the while loop

    echo "All available files processed."

    # Cleanup dummy files
    # rm -rf "$INPUT_DIR" "$PROCESSED_DIR" "$STATE_FILE"
    ```

---

**6. Advanced Parameter Expansion (`bash`)**

*   **What it does:** Performs complex string manipulations (prefix/suffix removal, search/replace, substring extraction, default values) directly within the shell using special variable syntax, avoiding external tools.
*   **Why you use it:** Often faster and more convenient than invoking `sed`, `awk`, `cut`, `basename`, etc., for common string operations within scripts, leading to potentially cleaner and more efficient code.
*   **Code (`bash`):**
    ```bash
    #!/bin/bash

    FILENAME="report_2025-04-28_final.csv.gz"
    URL="https://example.com/data/archive?user=test&pass=secret"
    EMPTY_VAR=""
    SET_VAR="some_value"

    # Remove Prefix (Shortest Match) - useful for directory paths
    FILEPATH="/home/user/data/report.txt"
    echo "Filename only (shortest prefix): ${FILEPATH#*/}" # Output: home/user/data/report.txt
    echo "Basename (longest prefix): ${FILEPATH##*/}" # Output: report.txt

    # Remove Suffix (Shortest Match)
    echo "Without .gz: ${FILENAME%.gz}" # Output: report_2025-04-28_final.csv
    echo "Without .csv.gz: ${FILENAME%.csv.gz}" # Output: report_2025-04-28_final
    # Remove Suffix (Longest Match)
    echo "Base filename (longest suffix): ${FILENAME%%.*}" # Output: report_2025-04-28_final

    # Substring Replacement (First occurrence)
    NEW_FILENAME_1="${FILENAME/final/draft}"
    echo "Replaced 'final' once: $NEW_FILENAME_1" # Output: report_2025-04-28_draft.csv.gz

    # Substring Replacement (All occurrences)
    NEW_FILENAME_2="${FILENAME//_/-}"
    echo "Replaced all '_': $NEW_FILENAME_2" # Output: report-2025-04-28-final.csv.gz

    # Substring Extraction (Offset and Length)
    DATE_PART="${FILENAME:7:10}" # Start at index 7 (0-based), length 10
    echo "Date part: $DATE_PART" # Output: 2025-04-28

    # Case Modification (Bash 4.0+)
    LOWERCASE_ME="MixedCaseString"
    echo "Lowercase: ${LOWERCASE_ME,,}" # Output: mixedcasestring
    echo "Uppercase: ${LOWERCASE_ME^^}" # Output: MIXEDCASESTRING

    # Use Default Value if var is unset or null
    echo "Default for EMPTY_VAR: ${EMPTY_VAR:-'default_value'}" # Output: default_value
    echo "Default for SET_VAR: ${SET_VAR:-'default_value'}"   # Output: some_value
    # Use Default Value only if var is unset (null is treated as set)
    echo "Default (unset only) for EMPTY_VAR: ${EMPTY_VAR-'default_unset_only'}" # Output: default_unset_only

    # Assign Default Value if unset or null
    echo "Assigning default to MAYBE_UNSET..."
    : "${MAYBE_UNSET:='assigned_default'}" # Note the := and the leading :
    echo "MAYBE_UNSET is now: $MAYBE_UNSET" # Output: assigned_default

    # Use Value from Alternative if var IS set and not null
    echo "Alternative for SET_VAR: ${SET_VAR:+'alternative_if_set'}" # Output: alternative_if_set
    echo "Alternative for EMPTY_VAR: ${EMPTY_VAR:+'alternative_if_set'}" # Output: (empty)

    # Error if unset or null
    # echo "Checking mandatory var..."
    # : "${MANDATORY_VAR:?"Mandatory variable not set!"}"
    # echo "This won't run if MANDATORY_VAR is unset or empty"

    ```

---