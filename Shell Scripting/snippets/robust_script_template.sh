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