#!/bin/bash
# Enable strict mode.
set -euo pipefail

# --- Configuration ---
SEARCH_DIR="./data_find_exec" # Directory to search within.
LOG_PATTERN="*.log" # Pattern for log files.
CSV_PATTERN="*.csv" # Pattern for CSV files.
TMP_PATTERN="*.tmp" # Pattern for temp files.
OLDER_THAN_DAYS=30 # Threshold for old files (modified time).
MIN_SIZE_KB=1024 # Threshold for large files (minimum size).

# --- Setup: Create dummy files for demonstration ---
echo "Creating dummy files and directories in $SEARCH_DIR..."
mkdir -p "$SEARCH_DIR"

# Create some log files with different modification times.
touch "$SEARCH_DIR/recent.log"
sleep 1
touch -d "35 days ago" "$SEARCH_DIR/old_log_file_1.log"
touch -d "40 days ago" "$SEARCH_DIR/old_log_file_2.log"

# Create some CSV files with different sizes.
tr -dc 'A-Za-z0-9,\n' < /dev/urandom | head -c 500000 > "$SEARCH_DIR/small.csv" # ~500KB
tr -dc 'A-Za-z0-9,\n' < /dev/urandom | head -c 2000000 > "$SEARCH_DIR/large_data_1.csv" # ~2MB
tr -dc 'A-Za-z0-9,\n' < /dev/urandom | head -c 1500000 > "$SEARCH_DIR/large_data_2.csv" # ~1.5MB

# Create some temp files.
touch "$SEARCH_DIR/tempfile_a.tmp"
touch "$SEARCH_DIR/tempfile_b.tmp"
echo "Setup complete."

# --- Example 1: Find and delete old log files (using xargs) ---
echo "Finding and deleting log files ($LOG_PATTERN) older than $OLDER_THAN_DAYS days in $SEARCH_DIR..."
# `find "$SEARCH_DIR"`: Start searching in the specified directory.
# `-maxdepth 1`: Do not descend into subdirectories (optional).
# `-type f`: Find only files.
# `-name "$LOG_PATTERN"`: Match files based on the pattern.
# `-mtime +$((OLDER_THAN_DAYS - 1))`: Find files whose data was last modified more than OLDER_THAN_DAYS days ago.
#   Note: `+N` means *more* than N*24 hours ago. `find` considers partial days, so `+29` finds files > 29*24h old (i.e., 30 days or older).
# `-print0`: Print found filenames separated by null characters (safe).
# `xargs -0 -r`: Read null-separated input (`-0`) and run the command (`rm -v`). `-r` prevents running `rm` if `find` finds nothing.
# `rm -v`: Remove files, verbose output.
find "$SEARCH_DIR" -maxdepth 1 -type f -name "$LOG_PATTERN" -mtime +$((OLDER_THAN_DAYS - 1)) -print0 | xargs -0 -r rm -v
echo "Deletion attempt complete."
echo "-----------------------------------"

# --- Example 2: Find large CSV files and compress them in parallel (using xargs) ---
echo "Finding CSV files ($CSV_PATTERN) larger than $MIN_SIZE_KB KB and compressing (using up to 4 parallel jobs)..."
# `-size +${MIN_SIZE_KB}k`: Find files strictly larger than MIN_SIZE_KB kilobytes.
# `xargs -0 -r`: Read null-separated input, don't run if input is empty.
# `-P 4`: Run up to 4 processes in parallel.
# `-I {}`: Replace occurrences of `{}` in the command with the input item (filename).
# `gzip -v "{}"`: The command to run for each file.
find "$SEARCH_DIR" -type f -name "$CSV_PATTERN" -size +${MIN_SIZE_KB}k -print0 | xargs -0 -r -P 4 -I {} gzip -v "{}"
echo "Compression attempt complete."
echo "-----------------------------------"

# --- Example 3: Using find -exec (simpler for single commands, potentially less efficient for many files) ---
echo "Finding temp files ($TMP_PATTERN) and changing permissions using -exec..."
# `-exec command {} \;`: Executes `command` for each found file. `{}` is replaced by the filename.
#   The command must end with `\;` (escaped semicolon).
#   This forks a new process (`chmod` in this case) for *every* file found, which can be slow.
find "$SEARCH_DIR" -type f -name "$TMP_PATTERN" -exec chmod 600 {} \;
echo "Permission change attempt complete."

# Alternative using -exec ... {} + (more efficient for many files):
# echo "Finding temp files (*.tmp) and changing permissions using -exec ..."
# `-exec command {} +`: Executes `command` with multiple filenames appended at once, reducing process forks.
# find "$SEARCH_DIR" -type f -name "$TMP_PATTERN" -exec chmod -v 600 {} +
# echo "Permission change attempt complete using -exec +."

# --- Cleanup ---
echo "Cleaning up dummy files..."
rm -rf "$SEARCH_DIR"
echo "Cleanup complete."