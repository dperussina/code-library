#!/bin/bash
# Enable strict mode.
set -euo pipefail

# --- Configuration ---
# Directory containing the files to be processed.
INPUT_DIR="./input_files_checkpoint"
# File to store the name of the last successfully processed file.
# Hidden file by convention.
STATE_FILE="./.process_state_checkpoint"
# Directory to move/copy processed files to (optional, for demonstration).
PROCESSED_DIR="./processed_files_checkpoint"
# Pattern for input files.
INPUT_PATTERN="*.dat"

# --- Setup ---
# Create directories if they don't exist.
# -p: Creates parent directories as needed, no error if exists.
mkdir -p "$INPUT_DIR" "$PROCESSED_DIR"
# Create dummy input files for the demo.
echo "Creating dummy input files in $INPUT_DIR..."
for i in {1..5}; do
    echo "Data for file $i" > "$INPUT_DIR/file_$i.dat"
done
# Create the state file if it doesn't exist.
touch "$STATE_FILE"

# --- Checkpoint Logic ---
# Read the name of the last successfully processed file from the state file.
# `tail -n 1` gets the last line, which should be the last processed file.
LAST_PROCESSED=$(tail -n 1 "$STATE_FILE" || true) # Use `|| true` to avoid error if file is empty
echo "State file '$STATE_FILE' indicates last processed file: '${LAST_PROCESSED:-None}'"

# Flag to indicate if we have found the point to resume from.
FOUND_LAST=0
# If the state file was empty (no last processed file recorded), start from the beginning.
if [[ -z "$LAST_PROCESSED" ]]; then
  echo "State file is empty or missing. Processing all files."
  FOUND_LAST=1 # Treat as if we've already passed the "last processed"
fi

# --- Processing Loop ---
echo "Searching for files matching '$INPUT_PATTERN' in '$INPUT_DIR'..."
# Find files matching the pattern in the input directory.
# `-maxdepth 1`: Don't look in subdirectories.
# `-type f`: Find only regular files.
# `-name "$INPUT_PATTERN"`: Match the filename pattern.
# `-print0`: Print filenames separated by null character (safe for special chars).
# `sort -z`: Sort the null-separated list (important for consistent processing order).
# `while IFS= read -r -d $'\0' file; do ... done`: Read null-separated input safely.
find "$INPUT_DIR" -maxdepth 1 -type f -name "$INPUT_PATTERN" -print0 | sort -z | while IFS= read -r -d $'\0' file; do
    # Get the base filename from the full path.
    FILENAME=$(basename "$file")

    # --- Resume Logic ---
    # If we haven't found the resume point yet...
    if [[ "$FOUND_LAST" -eq 0 ]]; then
        # Check if the current file is the last one we successfully processed.
        if [[ "$FILENAME" == "$LAST_PROCESSED" ]]; then
            echo "Found last successfully processed file '$FILENAME'. Resuming from the next file."
            FOUND_LAST=1 # Set flag to start processing from the *next* iteration.
        else
            # This file came before the last successfully processed one (or state file was missing).
            echo "Skipping '$FILENAME' (already processed according to state file)."
        fi
        # Continue to the next iteration of the loop (skip processing this file).
        continue
    fi

    # --- Actual Processing --- (Replace with your real command)
    echo "Processing '$FILENAME'..."
    # Example: Copy the file and simulate work with sleep.
    cp "$file" "$PROCESSED_DIR/" && sleep 0.5
    # Capture the exit status of the processing command.
    PROCESS_STATUS=$?

    # --- Update State File --- 
    # If the processing was successful (exit status 0)...
    if [[ $PROCESS_STATUS -eq 0 ]]; then
        echo "Successfully processed '$FILENAME'. Updating state file."
        # Overwrite the state file with the name of the file just processed.
        # Using > redirection truncates and writes.
        echo "$FILENAME" > "$STATE_FILE"
    else
        # If processing failed...
        echo "ERROR: Failed to process '$FILENAME' (exit status $PROCESS_STATUS). Stopping." >&2
        # Exit the script with an error code.
        exit 1
    fi

done

# --- Completion ---
echo "Checkpointing script finished. All available files processed."

# --- Cleanup (Optional) ---
# echo "Cleaning up dummy files and state..."
# rm -rf "$INPUT_DIR" "$PROCESSED_DIR" "$STATE_FILE"
exit 0