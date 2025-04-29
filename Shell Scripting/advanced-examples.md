**Reminder:** These snippets increasingly rely on specific tools (like `parallel`, `psql`, cloud CLIs, `jq`) being installed and configured, or specific `bash` versions. Always verify requirements and adapt syntax.
Okay, let's push into some genuinely advanced shell scripting territory. These snippets involve more complex interactions, concurrency patterns, specialized tools, and deeper shell features. They might be more niche, but can be powerful for specific automation or data pipeline tasks.

**Strong Reminder:** These examples often rely heavily on specific external tools being installed (`parallel`, `flock`, `psql`, cloud CLIs, `xmlstarlet`, etc.) and may require `bash` version 4 or higher. Test carefully and understand the underlying mechanisms. At this level of complexity, consider if a language like Python might offer better readability and maintainability.

---

**1. Advanced GNU Parallel Usage (Input Sources, Output Grouping)**

* **Purpose:** Execute jobs in parallel using inputs from multiple sources or grouping output based on input. Useful for complex parameter sweeps or structured parallel processing.
* **Requires:** `parallel` (GNU Parallel - needs installation: `sudo apt install parallel` or `brew install parallel`)
* **Shell Code (`bash` + `parallel`):**
    ```bash
    #!/bin/bash
    set -euo pipefail

    # --- Example 1: Combining inputs from two lists/files ---
    # Assume file 'params1.txt' contains: A B C
    # Assume file 'params2.txt' contains: 1 2 3
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
    # Process multiple input files, putting output in files named after input
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
    rm input_*.txt output_*.log # Cleanup demo files

    echo "---"

    # --- Example 3: Reading specific columns from a file ---
    echo "Name,Value1,Value2" > data.csv
    echo "alpha,10,100" >> data.csv
    echo "beta,20,200" >> data.csv

    echo "Processing specific columns from CSV..."
    # --colsep ',' : Use comma as column separator
    # Skips header automatically with --header :
    # parallel --colsep ',' echo "Got Name={1}, Value2={3}" :::: data.csv
    # Manual header skip if needed:
    tail -n +2 data.csv | parallel --colsep ',' echo "Got Name={1}, Value2={3}"
    rm data.csv # Cleanup

    ```
* **Explanation:**
    * `--link`: Pairs corresponding inputs from multiple `::::` (file) or `:::` (literal) sources.
    * `{}`: Placeholder for the entire input line/argument.
    * `{1}`, `{2}`: Placeholders for positional input arguments when using `--link` or multiple `:::`/`::::`.
    * `{.}`: Placeholder for the input item without the extension.
    * `{/}`: Placeholder for the basename of the input item.
    * `{}` `>` `{.}.log`: Shows how to redirect output for each parallel job into a corresponding file.
    * `--colsep`: Specifies column separator for reading structured input; `{1}`, `{2}`, etc. refer to columns.
    * `tail -n +2`: Skips header row when reading from file if `--header` isn't supported/used.
* **Notes:** GNU Parallel is extremely powerful with many options for job control, retries, remote execution, etc. Read its manual (`man parallel`) for details. It's a significant dependency to add if not already standard in your environment.

---

**2. Database Interaction with Transactions (Example: `psql`)**

* **Purpose:** Execute multiple SQL commands within a single database transaction from a shell script, ensuring atomicity (all succeed or all fail).
* **Requires:** Database command-line client (e.g., `psql` for PostgreSQL, `mysql` for MySQL). Database connection details.
* **Shell Code (`bash` + `psql`):**
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
         -c "\COPY users TO '$EXPORT_FILE' WITH (FORMAT CSV, HEADER);"

    if [ $? -eq 0 ]; then
        echo "Data exported successfully to $EXPORT_FILE"
    else
        echo "ERROR: Failed to export data." >&2
        # No transaction rollback needed for \COPY TO (it's usually non-transactional or read-only)
        exit 1
    fi

    ```
* **Explanation:**
    * `BEGIN; ... COMMIT;`: Standard SQL commands to define a transaction block. If any command between `BEGIN` and `COMMIT` fails, and the client/server enforces it, the entire block should be rolled back.
    * `psql -v ON_ERROR_STOP=1`: Crucial `psql` option. Tells `psql` to exit with a non-zero status immediately if any SQL error occurs, which then triggers `set -e` in the bash script.
    * `cat <<-EOF ... EOF`: A "here-document" used to embed the multi-line SQL commands into the `SQL_COMMANDS` variable. `<<-` allows leading tabs in the here-document to be ignored.
    * Variable Substitution: Shell variables (`$USER_NAME`, etc.) are substituted directly into the SQL string. **Warning:** This is vulnerable to SQL injection if variables contain untrusted input. Use parameterized queries or proper escaping functions provided by the DB client if dealing with external data.
    * `\COPY ... TO ...`: `psql`-specific command (note the backslash) for efficient server-side data export to a file accessible by the *server* process. Use `\copy ... to stdout` piped to a file for client-side export. (`COPY` without backslash is the SQL command, often requiring superuser privileges).
* **Notes:** Syntax for command-line clients (`mysql`, `sqlcmd`, etc.) and transaction control options differ. Handling secrets (passwords, keys) via environment variables is common but not ideal; use `.pgpass` (for `psql`), configuration files with restricted permissions, or credential management systems in production. Error handling and checking `$?` after DB commands are vital.

---

**3. Cloud CLI Interaction (Conditional Logic)**

* **Purpose:** Automate cloud tasks, making decisions based on the current state of cloud resources.
* **Requires:** Relevant cloud CLI installed and configured (e.g., `aws`, `gcloud`, `az`).
* **Shell Code (`bash` + AWS CLI Example):**
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
        CURRENT_TAG_VALUE=$(aws s3api get-bucket-tagging --bucket "$BUCKET_NAME" --region "$REGION" \
                            --query "TagSet[?Key=='$TAG_KEY'].Value" --output text)

        if [[ "$CURRENT_TAG_VALUE" == "$TAG_VALUE" ]]; then
            echo "Bucket already has the correct '$TAG_KEY' tag: '$TAG_VALUE'."
        else
            echo "Bucket exists but tag '$TAG_KEY' is '$CURRENT_TAG_VALUE'. Updating..."
            aws s3api put-bucket-tagging --bucket "$BUCKET_NAME" --region "$REGION" \
                --tagging "{\"TagSet\":[{\"Key\":\"$TAG_KEY\",\"Value\":\"$TAG_VALUE\"}]}"
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
        aws s3api put-bucket-tagging --bucket "$BUCKET_NAME" --region "$REGION" \
            --tagging "{\"TagSet\":[{\"Key\":\"$TAG_KEY\",\"Value\":\"$TAG_VALUE\"}]}"
        echo "Tag applied."
    fi

    echo "Script finished."
    ```
* **Explanation:**
    * The script checks if an S3 bucket exists by attempting an operation (`get-bucket-tagging`) that would fail if it doesn't. Output and errors (`> /dev/null 2>&1`) are suppressed, and the `if` checks the command's exit status (`$?`).
    * If the bucket exists, it retrieves the specific tag value using `--query` (a JMESPath expression for filtering JSON output) and `--output text`.
    * Conditional logic (`if [[ ... ]]`) compares the current tag value with the desired one and updates if necessary using `put-bucket-tagging`.
    * If the initial check fails, the script assumes the bucket needs creating and proceeds with `create-bucket` and `put-bucket-tagging`.
* **Notes:** Cloud CLI commands can be slow. Error handling can be complex (checking specific error codes/messages vs. relying on exit status). Use `--query` and `--output text` (or `jq`) to extract specific information needed for logic, rather than parsing verbose output. Adapt resource types and commands for GCP (`gcloud`) or Azure (`az`).

---

**4. File Locking (`flock`)**

* **Purpose:** Prevent multiple instances of a script from running concurrently, which is crucial for scripts modifying shared resources or those intended as singletons (e.g., cron jobs).
* **Requires:** `flock` utility (usually available on Linux).
* **Shell Code (`bash` + `flock`):**
    ```bash
    #!/bin/bash
    # Note: set -e might cause issues if flock fails immediately, handle carefully.
    set -u
    set -o pipefail

    LOCK_FILE="/var/tmp/my_script.lock" # Use a path accessible by the script's user

    # -n: Non-blocking - fail immediately if lock cannot be acquired
    # -E <retcode>: Exit code to use if lock fails (optional, default 1)
    # <fd>: File descriptor to use (e.g., 200)
    # The command to run under the lock
    (
        flock -n -E 10 200 || { echo "ERROR: Another instance is already running."; exit 10; }
        # --- Critical Section: Only one instance runs this part ---
        echo "Lock acquired ($$). Running critical section..."
        sleep 10 # Simulate work that should not run concurrently
        echo "Critical section finished ($$). Releasing lock."
        # Lock is released automatically when file descriptor 200 is closed (subshell exits)
        # --- End Critical Section ---
    ) 200>"$LOCK_FILE" # Open lock file on descriptor 200, redirect creates/truncates file

    # Check the exit code of the subshell
    FLOCK_EXIT_CODE=$?
    if [ $FLOCK_EXIT_CODE -eq 10 ]; then
      echo "Script could not acquire lock (exit code 10)."
      exit 1 # Exit main script if lock failed
    elif [ $FLOCK_EXIT_CODE -ne 0 ]; then
      echo "Script failed within the locked section (exit code $FLOCK_EXIT_CODE)." >&2
      exit $FLOCK_EXIT_CODE # Propagate error from critical section
    fi

    echo "Script completed normally."
    # Note: The lock file ($LOCK_FILE) remains but is empty. It's the *lock* on the file descriptor that matters.
    ```
* **Explanation:**
    * `(...) 200>"$LOCK_FILE"`: A subshell `(...)` is used. The redirection `200>"$LOCK_FILE"` opens the lock file for writing on file descriptor 200 *before* the subshell starts. This ensures the file exists for `flock`.
    * `flock -n -E 10 200`: Attempts to acquire an exclusive lock (`-x` is default) on file descriptor `200`. `-n` makes it non-blocking – if the lock is held by another process, `flock` fails immediately. `-E 10` sets the exit code to 10 on failure.
    * `|| { ... }`: If `flock` fails (returns non-zero), the commands in `{...}` are executed, printing an error and exiting the subshell with status 10.
    * Critical Section: Code inside the subshell after the `flock` command runs only if the lock was acquired.
    * Lock Release: The lock is associated with the file descriptor (`200`). When the subshell exits, descriptor 200 is closed, automatically releasing the lock.
* **Notes:** `flock` provides advisory locking (cooperating processes must all use `flock`). The lock file itself doesn't prevent access; it's the kernel mechanism `flock` uses. This is simpler than manual PID file management.

---

**5. Basic Checkpointing/Resuming**

* **Purpose:** Allow a long-running script processing items (e.g., files) to be stopped and resumed later from where it left off.
* **Concept:** Store the last successfully processed item's identifier or index in a state file. On startup, read the state file to determine where to resume. Update the state file after each successful processing step.
* **Shell Code (`bash`):**
    ```bash
    #!/bin/bash
    set -euo pipefail

    INPUT_DIR="./input_files"
    STATE_FILE="./.process_state"
    PROCESSED_DIR="./processed_files"

    mkdir -p "$PROCESSED_DIR"
    touch "$STATE_FILE" # Ensure state file exists

    # Read the last processed file, default to empty string if file is empty/doesn't exist
    LAST_PROCESSED=$(tail -n 1 "$STATE_FILE")
    echo "Last processed file according to state: '$LAST_PROCESSED'"

    FOUND_LAST=0
    if [[ -z "$LAST_PROCESSED" ]]; then
      FOUND_LAST=1 # Start from the beginning if state is empty
    fi

    # Use find and sort to get a consistent order
    find "$INPUT_DIR" -maxdepth 1 -type f -name "*.dat" -print0 | sort -z | while IFS= read -r -d $'\0' file; do
        FILENAME=$(basename "$file")

        # Skip files until we find the last processed one
        if [[ "$FOUND_LAST" -eq 0 ]]; then
            if [[ "$FILENAME" == "$LAST_PROCESSED" ]]; then
                echo "Found last processed file '$FILENAME'. Resuming from next."
                FOUND_LAST=1
            else
                echo "Skipping already processed file '$FILENAME'..."
            fi
            continue # Skip to the next file in the loop
        fi

        # --- Process the current file ---
        echo "Processing '$FILENAME'..."
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
    done

    echo "All available files processed."
    ```
* **Explanation:**
    * Reads the last line of a `STATE_FILE` to know which file was last completed.
    * Iterates through input files in a deterministic order (`sort -z`).
    * Skips files until the `LAST_PROCESSED` file is found (or starts immediately if state was empty).
    * Processes the current file.
    * If processing succeeds, it **overwrites** the `STATE_FILE` with the name of the just-completed file.
    * If processing fails, the script exits (due to `set -e` or explicit check), and the state file remains unchanged, pointing to the last *successful* file.
* **Notes:** This is a simple file-based approach. Assumes filenames are unique and processing order is stable. For more complex state, use more structured formats (e.g., JSON) in the state file. Error handling during state file read/write should be considered for production. `find ... -print0 | sort -z | while ... read -r -d $'\0'` is a robust way to handle filenames with special characters.

---

**6. Advanced Parameter Expansion (`bash`)**

* **Purpose:** Perform complex string manipulations directly within the shell without invoking external tools like `sed` or `awk`.
* **Requires:** `bash`
* **Shell Code (`bash`):**
    ```bash
    #!/bin/bash

    FILENAME="report_2025-04-28_final.csv.gz"
    URL="https://example.com/data/archive?user=test&pass=secret"

    # Remove Prefix (non-greedy shortest match ##)
    echo "Basename: ${FILENAME##*/}" # Output: report_2025-04-28_final.csv.gz (already basename here)

    # Remove Suffix (non-greedy shortest match %%)
    echo "Without .gz: ${FILENAME%.gz}" # Output: report_2025-04-28_final.csv
    echo "Without .csv.gz: ${FILENAME%.csv.gz}" # Output: report_2025-04-28_final

    # Remove Prefix (greedy longest match ##)
    # Remove Suffix (greedy longest match %%)
    # (Less common than non-greedy)

    # Substring Replacement (First occurrence)
    NEW_FILENAME_1="${FILENAME/final/draft}"
    echo "Replaced 'final': $NEW_FILENAME_1" # Output: report_2025-04-28_draft.csv.gz

    # Substring Replacement (All occurrences)
    NEW_FILENAME_2="${FILENAME//_/-}"
    echo "Replaced all '_': $NEW_FILENAME_2" # Output: report-2025-04-28-final.csv.gz

    # Substring Extraction (Offset and Length)
    DATE_PART="${FILENAME:7:10}" # Start at index 7 (0-based), length 10
    echo "Date part: $DATE_PART" # Output: 2025-04-28

    # Use Default Value if unset or null
    UNSET_VAR=""
    DEFAULT_VAL="${UNSET_VAR:-'default_value'}"
    echo "Default value: $DEFAULT_VAL" # Output: default_value

    # Use Value from Alternative if var IS set
    SET_VAR="actual_value"
    ALTERNATIVE_VAL="${SET_VAR:+'alternative_if_set'}"
    echo "Alternative when set: $ALTERNATIVE_VAL" # Output: alternative_if_set

    # Error if unset or null
    # : ${MANDATORY_VAR:?"Mandatory variable not set!"}
    # echo "This won't run if MANDATORY_VAR is unset"

    ```
* **Explanation:**
    * `${var#pattern}` / `${var##pattern}`: Remove shortest/longest matching *prefix*.
    * `${var%pattern}` / `${var%%pattern}`: Remove shortest/longest matching *suffix*. Patterns are shell globs.
    * `${var/pattern/string}`: Replace first match of `pattern` (glob) with `string`.
    * `${var//pattern/string}`: Replace *all* matches of `pattern` (glob) with `string`.
    * `${var:offset:length}`: Extract substring (0-based index).
    * `${var:-default}`: Use `default` if `var` is unset or null.
    * `${var:+alternative}`: Use `alternative` if `var` *is* set and not null.
    * `${var:?error_message}`: Exit with error if `var` is unset or null.
* **Notes:** These built-in expansions are often faster than calling external commands like `sed`, `cut`, `basename`, `dirname` for simple string tasks. Refer to `man bash` under "Parameter Expansion" for many more variations.

---

These examples showcase more intricate shell scripting capabilities. Remember that as complexity increases, the benefits of using a higher-level scripting language (like Python, Perl, or Ruby) often outweigh the conciseness of shell scripts, especially regarding error handling, data structures, and maintainability.