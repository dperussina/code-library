#!/bin/bash
set -euo pipefail

INPUT_DIR="./input_files"
STATE_FILE="./.process_state"
PROCESSED_DIR="./processed_files"

mkdir -p "$PROCESSED_DIR"
touch "$STATE_FILE"

LAST_PROCESSED=$(tail -n 1 "$STATE_FILE")
echo "Last processed file according to state: '$LAST_PROCESSED'"

FOUND_LAST=0
if [[ -z "$LAST_PROCESSED" ]]; then
  FOUND_LAST=1
fi

find "$INPUT_DIR" -maxdepth 1 -type f -name "*.dat" -print0 | sort -z | while IFS= read -r -d $'\0' file; do
    FILENAME=$(basename "$file")

    if [[ "$FOUND_LAST" -eq 0 ]]; then
        if [[ "$FILENAME" == "$LAST_PROCESSED" ]]; then
            echo "Found last processed file '$FILENAME'. Resuming from next."
            FOUND_LAST=1
        else
            echo "Skipping already processed file '$FILENAME'..."
        fi
        continue
    fi

    echo "Processing '$FILENAME'..."
    cp "$file" "$PROCESSED_DIR/" && sleep 1
    PROCESS_STATUS=$?

    if [[ $PROCESS_STATUS -eq 0 ]]; then
        echo "Successfully processed '$FILENAME'. Updating state."
        echo "$FILENAME" > "$STATE_FILE"
    else
        echo "ERROR: Failed to process '$FILENAME'. Stopping." >&2
        exit 1
    fi

done

echo "All available files processed."