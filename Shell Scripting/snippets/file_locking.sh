#!/bin/bash
# Enable strict mode options.
set -u # Treat unset variables as an error.
set -o pipefail # Pipeline return status is the last non-zero exit code.
# Note: -e (exit on error) is often used, but here we manage exits based on flock status.

# Define the path for the lock file.
# Using /var/tmp or /tmp is common for system-wide locks accessible by different users/processes.
# Ensure the directory exists and has appropriate permissions.
LOCK_FILE="/var/tmp/my_script_singleton.lock"

# --- Locking Mechanism using flock --- 
# We use a subshell `(...)` and redirect its file descriptor 200 to the lock file.
# This associates the file descriptor with the lock file for the duration of the subshell.
# File descriptor 200 is just an arbitrary number >= 10 that is unlikely to be used by the shell or commands.
(
    # `flock` is a utility to manage advisory locks on files.
    # `-n`: Non-blocking mode. Fail immediately if the lock cannot be acquired.
    # `-E 10`: Custom exit code to return if the lock cannot be acquired (due to -n).
    # `200`: The file descriptor associated with the lock file.
    # `|| { ... }`: If flock fails (returns non-zero, which will be 10 because of -E), execute the block.
    flock -n -E 10 200 || { echo "ERROR: Failed to acquire lock on '$LOCK_FILE'. Another instance may be running."; exit 10; }
    
    # --- Critical Section --- 
    # This code runs only if the lock was successfully acquired.
    echo "Lock acquired ($$) on '$LOCK_FILE'. Running critical section..."
    
    # Simulate work that should not run concurrently.
    sleep 5 
    
    echo "Critical section finished ($$). Releasing lock."
    # The lock is automatically released when the subshell exits and file descriptor 200 is closed.

) 200>"$LOCK_FILE" # Redirect FD 200 to the lock file for the subshell.
# The `>` ensures the lock file is created (or truncated) if it doesn't exist.

# --- Check Exit Status --- 
# Capture the exit status of the subshell.
FLOCK_EXIT_CODE=$?

# Check the exit code from the subshell.
if [ $FLOCK_EXIT_CODE -eq 10 ]; then
  # This exit code (10) was specifically set by `flock -E` when it failed to acquire the lock.
  echo "Script could not acquire lock (exit code 10). Exiting."
  # Exit the main script with a non-zero status indicating failure to lock.
  exit 1 
elif [ $FLOCK_EXIT_CODE -ne 0 ]; then
  # Any other non-zero exit code means an error occurred *within* the critical section (inside the subshell).
  echo "Script failed within the locked section (exit code $FLOCK_EXIT_CODE)." >&2
  # Propagate the error code from the critical section.
  exit $FLOCK_EXIT_CODE
fi

# If we reach here, the subshell exited with 0 (success).
echo "Script completed successfully."
exit 0