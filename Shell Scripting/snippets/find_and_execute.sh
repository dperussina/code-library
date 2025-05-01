#!/bin/bash
set -euo pipefail

SEARCH_DIR="./data"
FILE_PATTERN="*.log"
OLDER_THAN_DAYS=30 # Find files older than 30 days
MIN_SIZE_KB=1024 # Find files larger than 1024 KB (1MB)

# --- Example 1: Find and delete old log files ---
echo "Finding and deleting log files older than $OLDER_THAN_DAYS days in $SEARCH_DIR..."
find "$SEARCH_DIR" -maxdepth 1 -type f -name "$FILE_PATTERN" -mtime +$((OLDER_THAN_DAYS - 1)) -print0 | xargs -0 -r rm -v
echo "Deletion attempt complete."
echo "---"

# --- Example 2: Find large CSV files and compress them in parallel ---
echo "Finding CSV files larger than $MIN_SIZE_KB KB and compressing (using up to 4 parallel jobs)..."
find "$SEARCH_DIR" -type f -name "*.csv" -size +${MIN_SIZE_KB}k -print0 | xargs -0 -r -P 4 -I {} gzip "{}"
echo "Compression attempt complete."
echo "---"

# --- Example 3: Using find -exec (simpler for single commands, less efficient for many files) ---
echo "Finding temp files (*.tmp) and changing permissions using -exec..."
find "$SEARCH_DIR" -type f -name "*.tmp" -exec chmod 600 {} \;
echo "Permission change attempt complete."