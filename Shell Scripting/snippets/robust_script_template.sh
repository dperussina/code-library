#!/bin/bash

# ==============================================================================
# Robust Script Template
# ==============================================================================
# This template includes best practices for writing more reliable Bash scripts:
# - Strict mode (set -euo pipefail)
# - Logging function
# - Error handling function
# - Cleanup function (using trap)
# - Safe temporary file/directory creation
# ==============================================================================

# --- Strict Mode ---
# Exit immediately if a command exits with a non-zero status.
set -e
# Treat unset variables as an error when substituting.
set -u
# Prevent errors in a pipeline from being masked. The return value of a pipeline
# is the status of the last command to exit with a non-zero status,
# or zero if no command exited with a non-zero status.
set -o pipefail

# --- Globals ---
# Define script name for logging/messages.
readonly SCRIPT_NAME=$(basename "$0")
# Initialize variables that might be used globally, especially by cleanup.
TMP_DIR=""

# --- Logging Function ---
# Simple logging function prepending timestamp and level.
log() {
    local level="INFO"
    # Check if the first argument is a level (e.g., ERROR, WARN)
    if [[ "$1" =~ ^(INFO|WARN|ERROR|DEBUG)$ ]]; then
        level=$1
        shift # Remove the level from the arguments
    fi
    # Prepend timestamp and level to the message.
    echo "$(date '+%Y-%m-%d %H:%M:%S') - [${level}] - ${SCRIPT_NAME} - $*"
}

# --- Error Handling Function ---
# Logs an error message to stderr and exits.
error_exit() {
    # Log the error message passed as arguments.
    log "ERROR" "$*" >&2 # Ensure error messages go to stderr
    # The cleanup function is called automatically via the trap EXIT.
    exit 1
}

# --- Cleanup Function ---
# This function is executed on script exit (normal or error) via the trap.
cleanup() {
    local exit_code=$? # Capture the exit code of the command that triggered the trap
    log "DEBUG" "Entering cleanup function with exit code $exit_code..."
    # Remove temporary directory if it was created and exists.
    # Check if TMP_DIR is non-empty (-n) AND is a directory (-d).
    if [[ -n "$TMP_DIR" && -d "$TMP_DIR" ]]; then
        # Use rm -rf carefully!
        rm -rf "$TMP_DIR"
        log "Removed temporary directory: $TMP_DIR"
    fi
    
    # Add any other cleanup tasks here:
    # - Remove other temporary files
    # - Kill background processes (if any were started)
    # - Restore settings
    
    log "Cleanup finished."
    # Preserve the original exit code (important for signaling success/failure)
    exit $exit_code
}

# --- Trap ---
# Register the cleanup function to be called automatically on these signals:
# EXIT: Normal script termination or exit due to `exit` command or `set -e`.
# INT: Interrupt signal (usually Ctrl+C).
# TERM: Termination signal (e.g., from `kill`).
# HUP: Hangup signal.
trap cleanup EXIT INT TERM HUP

# ==============================================================================
# --- Main Script Logic --- 
# ==============================================================================
log "Script starting..."

# Example: Argument Parsing (consider using getopts for real scripts)
# if [[ $# -eq 0 ]]; then
#   error_exit "Usage: $SCRIPT_NAME <argument>"
# fi
# readonly INPUT_ARG=$1
# log "Input argument: ${INPUT_ARG}"

# Example: Create a temporary directory safely using mktemp.
# `mktemp -d` creates a unique directory in the default temporary location.
TMP_DIR=$(mktemp -d)
# Check if mktemp failed (though set -e should handle it, this adds explicit check).
if [[ ! -d "$TMP_DIR" ]]; then
    error_exit "Failed to create temporary directory."
fi
log "Created temporary directory: $TMP_DIR"

# --- Your Core Logic Here --- 
log "Starting main task..."
# Example command that might succeed or fail.
# Use `|| error_exit "Descriptive error message"` for robust error handling.
sleep 2 # Simulate work
# Example of a command that could fail:
# find /nonexistent_directory || error_exit "Failed to find directory."

log "Main task completed."
# --- End Core Logic ---

log "Script finished successfully."

# Cleanup is handled by the trap on EXIT.
# An explicit `exit 0` is often redundant when `set -e` is active and no errors occurred,
# but can be used for clarity.
exit 0