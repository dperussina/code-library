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