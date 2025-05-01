# Shell Scripting Code Snippets Library: Basic & Robust Examples

This document covers fundamental and robust shell scripting techniques useful for automation, system administration, and development tasks.

**Important Considerations:**

*   **Shell Dialects:** While many snippets will work in POSIX-compliant shells (`sh`), some utilize `bash`-specific features for convenience or power. These will be noted where applicable. For maximum portability, stick to POSIX features. For everyday use on Linux/macOS, `bash` is usually fine.
*   **Safety:** Always quote variables (`"$variable"`) to handle spaces and special characters correctly. Use `set -e` (exit on error), `set -u` (error on unset variables), and `set -o pipefail` (fail pipeline if any command fails) at the beginning of scripts for robustness (see snippet #1).
*   **Tools:** Many powerful snippets rely on standard command-line tools like `grep`, `sed`, `awk`, `find`, `xargs`, `sort`, `uniq`, `cut`, `curl`, `jq`. Ensure these are available on the target system (`jq` often needs explicit installation).

---

**1. Robust Script Template (Error Handling & Cleanup)**

*   **What it does:** Provides a starting template for scripts that ensures they exit on errors, handle unset variables, report pipeline failures, and perform cleanup actions (like removing temporary files) on exit or interruption.
*   **Why you use it:** To write more reliable and cleaner shell scripts by implementing standard error handling (`set -euo pipefail`), consistent logging, and automatic cleanup (`trap`). Essential for scripts used in automation or critical tasks.
*   **Code (`bash`):**
    ```bash
    #!/bin/bash

    # Exit immediately if a command exits with a non-zero status.
    set -e
    # Treat unset variables as an error when substituting.
    set -u
    # Pipes fail if any command in the pipe fails (not just the last one).
    set -o pipefail

    # --- Global Variables (if any) ---
    SCRIPT_NAME=$(basename "$0")
    TMP_DIR="" # Initialize temp dir variable

    # --- Functions ---
    log() {
        echo "$(date '+%Y-%m-%d %H:%M:%S') - INFO - $1"
    }

    error_exit() {
        echo "$(date '+%Y-%m-%d %H:%M:%S') - ERROR - $1" >&2 # Print error to stderr
        # Call cleanup function here if needed before exiting
        cleanup
        exit 1
    }

    cleanup() {
        log "Performing cleanup..."
        # Remove temporary directory if it was created
        if [[ -n "$TMP_DIR" && -d "$TMP_DIR" ]]; then
            rm -rf "$TMP_DIR"
            log "Removed temporary directory: $TMP_DIR"
        fi
        # Add other cleanup tasks here (e.g., killing background processes)
        log "Cleanup finished."
    }

    # --- Trap ---
    # Register the cleanup function to be called on EXIT (normal or error),
    # and on signals like INT (Ctrl+C) or TERM (kill).
    trap cleanup EXIT INT TERM

    # --- Main Script Logic ---
    log "Script starting..."

    # Example: Create a temporary directory safely
    TMP_DIR=$(mktemp -d)
    log "Created temporary directory: $TMP_DIR"
    # Check if mktemp failed (though set -e should handle it)
    if [[ ! -d "$TMP_DIR" ]]; then
        error_exit "Failed to create temporary directory."
    fi

    # --- Your main script logic goes here ---
    # Example: Simulate work and potential error
    log "Doing some work..."
    sleep 2
    # some_command_that_might_fail || error_exit "The command failed!"

    log "Script finished successfully."

    # The 'trap cleanup EXIT' automatically runs cleanup here on normal exit.
    # Explicit exit 0 is optional if set -e is active and no errors occurred.
    # exit 0
    ```

---

**2. Advanced Command-Line Argument Parsing (`getopts`)**

*   **What it does:** Parses short command-line options (like `-f`, `-v`, `-o value`) in a standard and robust way, handling options that require arguments and providing usage instructions.
*   **Why you use it:** To create user-friendly command-line tools with configurable behavior, standardizing how options and arguments are handled compared to manual parsing.
*   **Code (`bash` built-in):**
    ```bash
    #!/bin/bash
    set -euo pipefail

    # Default values
    VERBOSE=0
    OUTPUT_FILE=""
    MODE="default"

    usage() {
        echo "Usage: $0 [-v] [-o <output_file>] [-m <mode>] <input_file>"
        echo "  -v: Verbose mode"
        echo "  -o <output_file>: Specify output file path"
        echo "  -m <mode>: Specify mode (e.g., 'fast', 'safe')"
        echo "  <input_file>: Required input file"
        exit 1
    }

    # The colon ':' after an option character means it requires an argument.
    # Leading colon ':' suppresses default error messages, allowing custom handling.
    while getopts ":vo:m:h" opt; do
        case $opt in
            v)
                VERBOSE=1
                ;;
            o)
                OUTPUT_FILE="$OPTARG" # Argument stored in OPTARG
                ;;
            m)
                MODE="$OPTARG"
                ;;
            h)
                usage
                ;;
            \?) # Invalid option
                echo "Invalid option: -$OPTARG" >&2
                usage
                ;;
            :) # Missing argument
                echo "Option -$OPTARG requires an argument." >&2
                usage
                ;;
        esac
    done

    # Shift off the processed options, leaving remaining args (input_file)
    shift $((OPTIND - 1))

    # Check for required positional argument (input_file)
    if [ $# -ne 1 ]; then
        echo "Error: Input file is required." >&2
        usage
    fi
    INPUT_FILE="$1"

    # --- Use the parsed options ---
    echo "Verbose: $VERBOSE"
    echo "Output File: '${OUTPUT_FILE:-Not Set}'" # Use default if empty
    echo "Mode: $MODE"
    echo "Input File: $INPUT_FILE"

    # Example conditional logic
    if [ "$VERBOSE" -eq 1 ]; then
        echo "Verbose mode enabled."
        # Add verbose actions here
    fi

    if [ -n "$OUTPUT_FILE" ]; then
        echo "Processing will write to: $OUTPUT_FILE"
        # Add logic to use the output file
        # touch "$OUTPUT_FILE" || { echo "Error creating output file" >&2; exit 1; }
    else
        echo "Processing will write to standard output."
    fi
    ```

---

**3. Finding Files and Executing Commands (`find` + `xargs`)**

*   **What it does:** Finds files based on various criteria (name, type, size, modification time) and executes a command on the found files, potentially in parallel.
*   **Why you use it:** Powerful combination for batch processing files (e.g., deleting old logs, compressing large files, changing permissions) efficiently and safely, especially when dealing with filenames containing special characters (`-print0` / `-0`).
*   **Code:**
    ```bash
    #!/bin/bash
    set -euo pipefail

    SEARCH_DIR="./data"
    FILE_PATTERN="*.log"
    OLDER_THAN_DAYS=30 # Find files older than 30 days
    MIN_SIZE_KB=1024 # Find files larger than 1024 KB (1MB)

    # --- Example 1: Find and delete old log files ---
    echo "Finding and deleting log files older than $OLDER_THAN_DAYS days in $SEARCH_DIR..."
    # -type f: find files only
    # -name "$FILE_PATTERN": match filename pattern
    # -mtime +$((OLDER_THAN_DAYS - 1)): modified more than N*24 hours ago (+N means > N days)
    # -print0: print filename separated by null character (safe for special chars)
    # xargs -0: read null-separated input
    # rm -v: remove files, be verbose
    find "$SEARCH_DIR" -maxdepth 1 -type f -name "$FILE_PATTERN" -mtime +$((OLDER_THAN_DAYS - 1)) -print0 | xargs -0 -r rm -v
    # -r: Do not run rm if no files are found
    # -maxdepth 1: Search only in SEARCH_DIR, not subdirectories (optional)
    echo "Deletion attempt complete."
    echo "---"

    # --- Example 2: Find large CSV files and compress them in parallel ---
    echo "Finding CSV files larger than $MIN_SIZE_KB KB and compressing (using up to 4 parallel jobs)..."
    # -size +${MIN_SIZE_KB}k: find files larger than N kilobytes
    # xargs -P 4: run up to 4 processes in parallel
    # xargs -I {}: replace {} with the input filename
    # gzip "{}": command to run on each file
    find "$SEARCH_DIR" -type f -name "*.csv" -size +${MIN_SIZE_KB}k -print0 | xargs -0 -r -P 4 -I {} gzip "{}"
    echo "Compression attempt complete."
    echo "---"

    # --- Example 3: Using find -exec (simpler for single commands, less efficient for many files) ---
    echo "Finding temp files (*.tmp) and changing permissions using -exec..."
    # -exec command {} \; : Executes 'command' for each file, '{}' is replaced by filename.
    # The command runs once per file. The semicolon must be escaped or quoted.
    find "$SEARCH_DIR" -type f -name "*.tmp" -exec chmod 600 {} \;
    echo "Permission change attempt complete."
    ```

---

**4. Advanced Text Processing (`awk`, `sed`, `join`)**

*   **`awk` for Calculations and Reporting**
    *   **What it does:** Processes text files line by line, splitting them into fields, and allows performing calculations, aggregations, and formatted reporting based on the field data.
    *   **Why you use it:** Extremely effective for manipulating structured text data (like CSV or space-delimited files), calculating sums/averages per category, and generating custom reports without complex looping in shell.
    *   **Code:**
        ```bash
        #!/bin/bash
        # Example: Process a CSV file (data.csv) assumed to have columns: ID,Category,Value
        # Calculate sum and average value per category.

        # Create dummy data.csv for example
        cat << EOF > data.csv
        ID,Category,Value
        1,Alpha,10.5
        2,Beta,20.0
        3,Alpha,15.5
        4,Gamma,5.0
        5,Beta,25.0
        EOF

        echo "Processing data.csv with awk..."
        awk -F',' 'NR > 1 { # -F sets field separator, NR > 1 skips header row
            sum[$2] += $3; # Sum column 3 ($3) grouping by column 2 ($2)
            count[$2]++;   # Count items per category
        }
        END { # Runs after processing all lines
            print "Category,TotalValue,Count,AverageValue"; # Print header
            for (cat in sum) {
                average = sum[cat] / count[cat];
                printf "%s,%.2f,%d,%.2f\n", cat, sum[cat], count[cat], average;
            }
        }' data.csv # Input file

        rm data.csv # Clean up dummy file
        ```

*   **`sed` for In-Place Editing or Complex Substitution**
    *   **What it does:** Performs text transformations on streams or files, commonly used for search-and-replace operations. Can edit files directly (`-i`).
    *   **Why you use it:** Useful for making systematic changes across files (e.g., updating configuration values, correcting common errors) or extracting/reformatting specific parts of lines using regular expressions and capture groups.
    *   **Code:**
        ```bash
        #!/bin/bash
        # Example: Replace all occurrences of "Error" with "Warning" in specific log files
        # WARNING: sed -i modifies files directly. Backup first or test without -i.

        LOG_DIR="./logs_sed_example"
        PATTERN="error_report_*.log"
        mkdir -p "$LOG_DIR"
        echo "An Error occurred in report 1." > "$LOG_DIR/error_report_1.log"
        echo "Another error message." > "$LOG_DIR/error_report_2.log"
        echo "All ok here." > "$LOG_DIR/status.log"

        echo "Running sed replacement..."
        # Find log files and use sed to replace text
        # Use find + xargs for potentially many files
        find "$LOG_DIR" -maxdepth 1 -type f -name "$PATTERN" -print0 | \
            xargs -0 -r sed -i.bak 's/Error/Warning/gi'
            # -i.bak: Edit in-place, create backup with .bak extension
            # s/old/new/g: Substitute old with new, globally on each line
            # i: Case-insensitive match

        echo "Replacement attempt complete. Backup files created with .bak extension."
        echo "Contents of modified files:"
        cat "$LOG_DIR"/*.log

        echo "---"
        # Example 2: Extract specific data using capture groups (no -i)
        # Extract YYYY-MM-DD from lines like "Timestamp: 2025-04-28 ..."
        echo "Extracting date:"
        echo "Timestamp: 2025-04-28 Data" | sed -n 's/^Timestamp: \([0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}\).*/\1/p'
        # -n: Suppress default output
        # s/.../.../p: Substitute and print only if substitution occurs
        # \(...\): Capture group
        # \1: Backreference to the first capture group
        # \{N\}: Match preceding item N times (Basic Regex)

        # Clean up
        rm -rf "$LOG_DIR"
        ```

*   **`join` Command for Relational Data in Files**
    *   **What it does:** Performs relational database-style joins on lines from two files based on a common field.
    *   **Why you use it:** To combine related data from different text files based on a shared key column, similar to a SQL JOIN, without needing a database. Requires input files to be sorted on the join key.
    *   **Code:**
        ```bash
        #!/bin/bash
        # Example: Join two sorted text files based on a common key field.
        # Assumes file1.txt and file2.txt are sorted on their first field (the key).

        # Create dummy sorted files for example
        cat << EOF > file1.sorted.txt
        101,Alice,Admin
        102,Bob,Dev
        104,Charlie,Dev
        EOF

        cat << EOF > file2.sorted.txt
        101,New York
        102,London
        103,Paris
        EOF

        echo "Joining files..."
        # -t,: Use comma as delimiter
        # -1 1: Join on field 1 of file 1
        # -2 1: Join on field 1 of file 2
        # -a 1: Print unpairable lines from file 1 (like LEFT JOIN)
        # -o FORMAT: Specify output format (0=join field, 1.N=field N from file 1, 2.N=field N from file 2)
        join -t',' -1 1 -2 1 \
             -a 1 \
             -o 0,1.2,1.3,2.2 \
             file1.sorted.txt file2.sorted.txt > joined_output.txt

        echo "Join complete. Output in joined_output.txt:"
        cat joined_output.txt
        # Expected Output:
        # 101,Alice,Admin,New York
        # 102,Bob,Dev,London
        # 104,Charlie,Dev,

        # Clean up dummy files
        rm file1.sorted.txt file2.sorted.txt joined_output.txt
        ```

---

**5. Advanced Web Interaction (`curl` + `jq`)**

*   **`curl` POST Request with JSON Data + `jq` Filtering**
    *   **What it does:** Sends an HTTP POST request with a JSON payload constructed using `jq`, then parses the JSON response using `jq` to extract specific data fields.
    *   **Why you use it:** Common pattern for interacting with web APIs. Using `jq` to build and parse JSON is safer and more robust than manual string manipulation in shell. Allows easy extraction of needed information from complex API responses.
    *   **Code:**
        ```bash
        #!/bin/bash
        set -euo pipefail

        API_ENDPOINT="https://httpbin.org/post" # Test endpoint that echoes request
        AUTH_TOKEN="your_secret_token_here"    # Example token

        # Data to send as JSON payload
        # Use jq to safely create JSON, handling special characters
        JSON_PAYLOAD=$(jq -n --arg name "Gadget" --arg quantity 5 \
          '{ "item_name": $name, "qty": $quantity, "options": ["red", "large"] }')
          # jq -n: Use null input to construct JSON
          # --arg var val: Pass shell variable as jq string variable

        echo "Sending POST request to $API_ENDPOINT"
        echo "Payload: $JSON_PAYLOAD"

        # Use curl to send the request
        # -s: Silent mode (no progress meter)
        # -X POST: Specify POST method
        # -H 'Header: Value': Set custom headers
        # -d "$JSON_PAYLOAD": Send data payload
        RESPONSE=$(curl -s -X POST \
          -H 'Content-Type: application/json' \
          -H "Authorization: Bearer $AUTH_TOKEN" \
          -d "$JSON_PAYLOAD" \
          "$API_ENDPOINT")

        # Check curl exit status (though set -e should catch failures)
        if [ $? -ne 0 ]; then
          echo "Error: curl command failed." >&2
          exit 1
        fi

        echo "--- Raw Response --- "
        # Check if response seems like valid JSON before proceeding
        if ! echo "$RESPONSE" | jq empty > /dev/null 2>&1; then
            echo "Error: Response is not valid JSON." >&2
            echo "$RESPONSE"
            exit 1
        fi
        echo "$RESPONSE" | jq . # Pretty-print JSON response
        echo "--- End Raw Response --- "

        # Process response with jq
        echo "Extracting data from response using jq..."
        # Example: Extract the 'json' part echoed back by httpbin, then get 'item_name'
        # Use || echo "null" to handle cases where the path doesn't exist, preventing jq error
        ITEM_NAME=$(echo "$RESPONSE" | jq -r '.json.item_name // "Not found"')
        # Example: Extract the first option from the 'options' array
        FIRST_OPTION=$(echo "$RESPONSE" | jq -r '.json.options[0] // "Not found"')
        # Example: Check if 'Origin' IP is present in response headers
        ORIGIN_IP=$(echo "$RESPONSE" | jq -r '.headers."X-Forwarded-For" // .origin // "Unknown"') # Use fallback with //

        echo "Item Name from response: $ITEM_NAME"
        echo "First Option from response: $FIRST_OPTION"
        echo "Origin IP from response: $ORIGIN_IP"
        ```

---

**6. Advanced Shell Features (`bash`)**

*   **Process Substitution**
    *   **What it does:** Allows the output of a command (or multiple commands) to be treated as a file directly on the command line of another command.
    *   **Why you use it:** Avoids the need for temporary files when comparing the output of commands (`diff <(cmd1) <(cmd2)`) or providing generated configuration to tools that expect a file input (`tool -c <(generate_config)`).
    *   **Code (`bash`, `zsh`, `ksh`):**
        ```bash
        #!/bin/bash
        # Example: Compare the output of two commands using diff, without temporary files

        echo "Comparing differences between ls output of /etc and /usr/lib (if they exist)..."

        # Check if directories exist before attempting ls
        ETC_LIST="/dev/null"
        if [ -d /etc ]; then ETC_LIST=$(ls -1 /etc | sort); fi

        USR_LIB_LIST="/dev/null"
        if [ -d /usr/lib ]; then USR_LIB_LIST=$(ls -1 /usr/lib | sort); fi

        # diff requires two file arguments.
        # <(command) runs 'command' and presents its output as if it were a file.
        # Using process substitution with the command output stored in variables
        diff <(echo "$ETC_LIST") <(echo "$USR_LIB_LIST")
        echo "Diff complete."

        echo "---"

        # Example: Passing structured arguments to a command expecting a file
        # Imagine 'my_tool' reads configuration lines from a file specified by -c
        echo "Running hypothetical my_tool with generated config..."
        # my_tool -c <(
        #   echo "setting1=value1"
        #   echo "setting2=value_with_spaces"
        #   # Example: include lines from another file if it exists
        #   if [ -f /some/other/config/file ]; then
        #       grep '^important' /some/other/config/file
        #   fi
        # )
        # # Replace above with an actual command if you have one to test
        echo "(Skipping actual execution of my_tool in example)"
        ```

*   **Associative Arrays (`bash` 4.0+)**
    *   **What it does:** Provides hash map or dictionary-like data structures within Bash, allowing key-value storage where keys are strings.
    *   **Why you use it:** Useful for mapping, lookups, and storing structured data within a script without resorting to external tools or complex string parsing. Great for configuration or tracking states.
    *   **Code (`bash` 4.0+):**
        ```bash
        #!/bin/bash
        # Requires bash version 4.0 or later

        # Check Bash version (optional but good practice)
        if (( BASH_VERSINFO[0] < 4 )); then
            echo "Error: Bash version 4.0 or higher is required for associative arrays." >&2
            exit 1
        fi

        # Declare an associative array (like a dictionary or hash map)
        declare -A user_roles

        # Assign key-value pairs
        user_roles["alice"]="admin"
        user_roles["bob"]="developer"
        user_roles["charlie"]="viewer"

        # Access a value by key
        USER_TO_CHECK="bob"
        # Use quotes around key for safety, although often works without for simple keys
        ROLE=${user_roles["$USER_TO_CHECK"]}
        echo "Role for $USER_TO_CHECK: $ROLE" # Output: developer

        # Check if a key exists (safer than checking if value is empty)
        if [[ -v user_roles["david"] ]]; then
            echo "David has a role: ${user_roles["david"]}"
        else
            echo "David does not have a role assigned."
        fi

        # Add another user
        user_roles["david"]="guest"

        # Iterate over keys
        echo "All users (keys):"
        # Quote "${!user_roles[@]}" to handle keys with spaces correctly if they existed
        for user in "${!user_roles[@]}"; do
            echo " - $user"
        done

        # Iterate over values
        echo "All roles (values):"
        # Quote "${user_roles[@]}" to handle values with spaces correctly
        for role in "${user_roles[@]}"; do
            echo " - $role"
        done

        # Iterate over key-value pairs
        echo "User-Role mapping:"
        for user in "${!user_roles[@]}"; do
            echo " - User: $user, Role: ${user_roles[$user]}"
        done

        # Remove an element
        unset user_roles["charlie"]
        echo "Removed charlie. Remaining users: ${!user_roles[@]}"
        ```

These advanced snippets provide more tools for creating sophisticated, robust, and efficient shell scripts.