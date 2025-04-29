**Important Considerations:**

* **Shell Dialects:** While many snippets will work in POSIX-compliant shells (`sh`), some utilize `bash`-specific features for convenience or power. These will be noted where applicable. For maximum portability, stick to POSIX features. For everyday use on Linux/macOS, `bash` is usually fine.
* **Safety:** Always quote variables (`"$variable"`) to handle spaces and special characters correctly. Use `set -e` (exit on error), `set -u` (error on unset variables), and `set -o pipefail` (fail pipeline if any command fails) at the beginning of scripts for robustness.
* **Tools:** Many powerful snippets rely on standard command-line tools like `grep`, `sed`, `awk`, `find`, `xargs`, `sort`, `uniq`, `cut`, `curl`, `jq`. Ensure these are available on the target system (`jq` often needs explicit installation).
Okay, let's add some more advanced Bash/shell scripting snippets to your collection. These cover more complex logic, robust scripting practices, advanced text processing, and interactions with external tools.

**Reminder:** Continue to prioritize quoting variables (`"$var"`), using `set -euo pipefail` (explained in snippet #1), and noting `bash`-specific features.

---

**1. Robust Script Template (Error Handling & Cleanup)**

* **Purpose:** A starting template for scripts that ensures they exit on errors, handle unset variables, report pipeline failures, and perform cleanup actions (like removing temporary files) on exit or interruption.
* **Shell Code (`bash`):**
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
* **Explanation:**
    * `set -euo pipefail`: Sets strict error-checking modes (essential for reliable scripts).
    * `log`, `error_exit`: Basic functions for consistent output and error handling. `error_exit` prints to standard error (`>&2`) and ensures cleanup runs before exiting with a non-zero status.
    * `cleanup`: A function to remove temporary files/directories or perform other shutdown tasks.
    * `trap cleanup EXIT INT TERM`: Registers the `cleanup` function to run automatically when the script exits for any reason (normal completion, error via `exit` or `set -e`, or signals like Ctrl+C).
    * `mktemp -d`: Securely creates a temporary directory. Its path is stored in `TMP_DIR` for use in `cleanup`.
* **Notes:** This template provides a solid foundation for writing more reliable and cleaner scripts. Customize the `cleanup` function based on your script's needs.

---

**2. Advanced Command-Line Argument Parsing (`getopts`)**

* **Purpose:** Parsing short command-line options (like `-f`, `-v`, `-o value`) in a standard and robust way, handling options that require arguments.
* **Shell Code (`bash` built-in):**
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
* **Explanation:**
    * `getopts "..." opt`: Iterates through command-line arguments looking for options defined in the option string (e.g., `":vo:m:h"`).
    * `:` after `o` and `m` means they expect an argument, which `getopts` places in the `OPTARG` variable.
    * Leading `:` in the option string enables custom error handling for invalid options (`\?`) and missing arguments (`:`).
    * `case "$opt" in ... esac`: Handles each valid option found.
    * `shift $((OPTIND - 1))`: Removes the parsed options and their arguments from the positional parameters (`$@`), leaving only the non-option arguments (like `input_file`).
    * `$#`: Checks the number of remaining arguments.
* **Notes:** `getopts` is built into `bash` and handles short options well. For long options (e.g., `--verbose`, `--output-file`), the external GNU `getopt` command is often used, but its syntax is more complex and less portable.

---

**3. Finding Files and Executing Commands (`find` + `xargs`)**

* **Purpose:** Find files based on complex criteria and perform an action (like delete, rename, process) on each found file, often in parallel.
* **Shell Code:**
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
* **Explanation:**
    * `find <dir> [criteria]`: Searches for files/directories. Key criteria include `-name`, `-type`, `-mtime` (modification time), `-size`.
    * `-print0`: Safely handles filenames with spaces or special characters by using a null terminator. Essential when piping to `xargs -0`.
    * `xargs [options] command`: Reads items from standard input and executes `command`, passing the items as arguments.
    * `xargs -0`: Expects null-terminated input (from `find -print0`).
    * `xargs -r`: Prevents running the command if the input is empty.
    * `xargs -P N`: Runs up to N commands in parallel.
    * `xargs -I {}`: Replaces `{}` in the command with the input item (useful when filename isn't the last argument).
    * `find ... -exec command {} \;`: Alternative to `xargs` for running a single command per file. Often less efficient than `xargs` for many files because it spawns a new process for each file.
* **Notes:** `find` and `xargs` are incredibly powerful for batch file operations. Always test `find` commands without the `-exec` or `| xargs rm` part first to ensure you're selecting the correct files.

---

**4. Advanced Text Processing (`awk`, `sed`, `join`)**

* **`awk` for Calculations and Reporting**
    ```bash
    #!/bin/bash
    # Example: Process a CSV file (data.csv) assumed to have columns: ID,Category,Value
    # Calculate sum and average value per category.

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
    ```
    * **Explanation:** `awk` processes files line by line, splitting lines into fields (here, using comma `-F','`). It uses associative arrays (`sum`, `count`) keyed by the category (`$2`) to accumulate totals and counts. The `END` block executes after all lines are read, iterating through the collected categories to print the summary report, formatted using `printf`.
    * **Notes:** `awk` is a powerful programming language for structured text data manipulation, especially column-based data.

* **`sed` for In-Place Editing or Complex Substitution**
    ```bash
    #!/bin/bash
    # Example: Replace all occurrences of "Error" with "Warning" in specific log files
    # WARNING: sed -i modifies files directly. Backup first or test without -i.

    LOG_DIR="./logs"
    PATTERN="error_report_*.log"

    # Find log files and use sed to replace text
    # Use find + xargs for potentially many files
    find "$LOG_DIR" -maxdepth 1 -type f -name "$PATTERN" -print0 | \
        xargs -0 -r sed -i.bak 's/Error/Warning/gi'
        # -i.bak: Edit in-place, create backup with .bak extension
        # s/old/new/g: Substitute old with new, globally on each line
        # i: Case-insensitive match

    echo "Replacement attempt complete. Backup files created with .bak extension."

    # Example 2: Extract specific data using capture groups (no -i)
    # Extract YYYY-MM-DD from lines like "Timestamp: 2025-04-28 ..."
    echo "Timestamp: 2025-04-28 Data" | sed -n 's/^Timestamp: \([0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}\).*/\1/p'
    # -n: Suppress default output
    # s/.../.../p: Substitute and print only if substitution occurs
    # \(...\): Capture group
    # \1: Backreference to the first capture group
    # \{N\}: Match preceding item N times (Basic Regex)
    ```
    * **Explanation:** `sed` (Stream Editor) modifies text based on commands. `s/old/new/g` is the substitute command (global on the line). `-i` modifies the file in-place (use with extreme caution!). Capture groups `\(...\)` and backreferences `\1`, `\2`, etc., allow complex restructuring and extraction.
    * **Notes:** `sed` syntax (especially regex flavor - Basic vs. Extended) can vary. `-i` behavior differs slightly between GNU `sed` (Linux) and BSD `sed` (macOS). Always test `sed` commands without `-i` first.

* **`join` Command for Relational Data in Files**
    ```bash
    #!/bin/bash
    # Example: Join two sorted text files based on a common key field.
    # Assumes file1.txt and file2.txt are sorted on their first field (the key).

    # file1.txt example:
    # 101,Alice,Admin
    # 102,Bob,Dev
    # 104,Charlie,Dev

    # file2.txt example:
    # 101,New York
    # 102,London
    # 103,Paris

    # Ensure files are sorted (required by join)
    sort -t',' -k1,1 file1.txt -o file1.sorted.txt
    sort -t',' -k1,1 file2.txt -o file2.sorted.txt

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
    # Output in joined_output.txt:
    # 101,Alice,Admin,New York
    # 102,Bob,Dev,London
    # 104,Charlie,Dev,

    echo "Join complete. Output in joined_output.txt"
    # Clean up sorted files (optional)
    # rm file1.sorted.txt file2.sorted.txt
    ```
    * **Explanation:** The `join` command performs relational database-style joins on lines from two files, provided they are sorted on the join field. `-t` specifies the delimiter. `-1 N` and `-2 M` specify the join fields in file 1 and file 2. `-a` includes lines without matches (like outer joins). `-o` formats the output.
    * **Notes:** Input files *must* be sorted lexicographically on the join field. `join` is powerful for combining simple structured text files without needing a full database.

---

**5. Advanced Web Interaction (`curl` + `jq`)**

* **`curl` POST Request with JSON Data + `jq` Filtering**
    ```bash
    #!/bin/bash
    set -euo pipefail

    API_ENDPOINT="https://httpbin.org/post" # Test endpoint that echoes request
    AUTH_TOKEN="your_secret_token_here"    # Example token

    # Data to send as JSON payload
    JSON_PAYLOAD=$(jq -n --arg name "Gadget" --arg quantity 5 \
      '{ "item_name": $name, "qty": $quantity, "options": ["red", "large"] }')
      # jq -n: Use null input to construct JSON
      # --arg var val: Pass shell variable as jq string variable

    echo "Sending POST request to $API_ENDPOINT"
    echo "Payload: $JSON_PAYLOAD"

    # -s: Silent mode (no progress meter)
    # -X POST: Specify POST method
    # -H 'Content-Type: application/json': Set header
    # -H "Authorization: Bearer $AUTH_TOKEN": Example auth header
    # -d "$JSON_PAYLOAD": Send data payload
    RESPONSE=$(curl -s -X POST \
      -H 'Content-Type: application/json' \
      -H "Authorization: Bearer $AUTH_TOKEN" \
      -d "$JSON_PAYLOAD" \
      "$API_ENDPOINT")

    echo "--- Raw Response ---"
    echo "$RESPONSE"
    echo "---"

    # Process response with jq
    echo "Extracting data from response using jq..."
    # Example: Extract the 'json' part echoed back by httpbin, then get 'item_name'
    ITEM_NAME=$(echo "$RESPONSE" | jq -r '.json.item_name')
    # Example: Extract the first option from the 'options' array
    FIRST_OPTION=$(echo "$RESPONSE" | jq -r '.json.options[0]')
    # Example: Check if 'Origin' IP is present in response headers
    ORIGIN_IP=$(echo "$RESPONSE" | jq -r '.headers."X-Forwarded-For" // .origin') # Use fallback with //

    echo "Item Name from response: $ITEM_NAME"
    echo "First Option from response: $FIRST_OPTION"
    echo "Origin IP from response: $ORIGIN_IP"
    ```
* **Explanation:** Uses `jq -n` to safely construct a JSON payload from variables. `curl` sends a POST request with appropriate headers (`-H`) and the JSON data (`-d`). The response (which is often JSON) is captured in a variable and then piped to `jq` for extracting specific fields using path expressions (`.json.item_name`, `.json.options[0]`). `-r` gets raw string output from `jq`. `//` provides a fallback value in `jq` if a key is missing.
* **Notes:** Building JSON safely using `jq` or dedicated tools is better than manual string concatenation. Remember to handle sensitive data like tokens securely (e.g., using environment variables or secret management tools, not hardcoding).

---

**6. Advanced Shell Features**

* **Process Substitution**
    ```bash
    #!/bin/bash
    # Example: Compare the output of two commands using diff, without temporary files

    echo "Comparing differences between ls output of /etc and /usr/lib..."

    # diff requires two file arguments.
    # <(command) runs 'command' and presents its output as if it were a file.
    diff <(ls -1 /etc | sort) <(ls -1 /usr/lib | sort)

    echo "---"

    # Example: Passing structured arguments to a command expecting a file
    # Imagine 'my_tool' reads configuration lines from a file specified by -c
    echo "Running my_tool with generated config..."
    # my_tool -c <(
    #   echo "setting1=value1"
    #   echo "setting2=value_with_spaces"
    #   grep '^important' /some/other/config/file # Include important lines from elsewhere
    # )
    # # Replace above with an actual command if you have one to test
    echo "(Skipping actual execution of my_tool in example)"
    ```
* **Explanation:** Process substitution `<(command)` runs `command` in the background, connects its standard output to a special file descriptor (like `/dev/fd/63`), and substitutes that file descriptor path onto the command line. This allows commands that expect filenames as arguments to read directly from the output of other commands without explicit temporary files. `>(command)` works similarly for output.
* **Notes:** This is a powerful feature available in `bash`, `zsh`, and `ksh`, but not standard POSIX `sh`.

* **Associative Arrays (`bash` 4.0+)**
    ```bash
    #!/bin/bash
    # Requires bash version 4.0 or later

    # Declare an associative array (like a dictionary or hash map)
    declare -A user_roles

    # Assign key-value pairs
    user_roles["alice"]="admin"
    user_roles["bob"]="developer"
    user_roles["charlie"]="viewer"

    # Access a value by key
    USER_TO_CHECK="bob"
    ROLE=${user_roles["$USER_TO_CHECK"]}
    echo "Role for $USER_TO_CHECK: $ROLE" # Output: developer

    # Check if a key exists
    if [[ -v user_roles["david"] ]]; then
        echo "David has a role."
    else
        echo "David does not have a role assigned."
    fi

    # Iterate over keys
    echo "All users:"
    for user in "${!user_roles[@]}"; do
        echo " - $user"
    done

    # Iterate over values
    echo "All roles:"
    for role in "${user_roles[@]}"; do
        echo " - $role"
    done

    # Iterate over key-value pairs
    echo "User-Role mapping:"
    for user in "${!user_roles[@]}"; do
        echo " - User: $user, Role: ${user_roles[$user]}"
    done
    ```
* **Explanation:** Associative arrays allow you to store and retrieve values using string keys, similar to dictionaries in Python. `declare -A` creates one. `${array["key"]}` accesses values. `${!array[@]}` gets all keys. `${array[@]}` gets all values.
* **Notes:** This is a `bash` 4.0+ specific feature, not available in older `bash` or POSIX `sh`. It's very useful for mapping and lookup tasks within scripts.

These advanced snippets provide more tools for creating sophisticated, robust, and efficient shell scripts for various engineering and data science automation tasks.