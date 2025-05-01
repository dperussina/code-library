#!/bin/bash
set -u
set -o pipefail

LOCK_FILE="/var/tmp/my_script.lock"

(
    flock -n -E 10 200 || { echo "ERROR: Another instance is already running."; exit 10; }
    echo "Lock acquired ($$). Running critical section..."
    sleep 10
    echo "Critical section finished ($$). Releasing lock."
) 200>"$LOCK_FILE"

FLOCK_EXIT_CODE=$?
if [ $FLOCK_EXIT_CODE -eq 10 ]; then
  echo "Script could not acquire lock (exit code 10)."
  exit 1
elif [ $FLOCK_EXIT_CODE -ne 0 ]; then
  echo "Script failed within the locked section (exit code $FLOCK_EXIT_CODE)." >&2
  exit $FLOCK_EXIT_CODE
fi

echo "Script completed normally."