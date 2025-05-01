#!/bin/bash
# Enable strict mode.
set -euo pipefail

# --- Default values for options ---
# Use uppercase for global variables/constants by convention.
VERBOSE=0 # 0 for false, 1 for true (Bash doesn't have true booleans)
OUTPUT_FILE=""
MODE="default"

# --- Usage function ---
# Prints help message and exits.
usage() {
    # $0 is the script name.
    echo "Usage: $0 [-v] [-o <output_file>] [-m <mode>] [-h] <input_file>"
    echo "  -v              : Enable verbose output."
    echo "  -o <output_file>: Specify output file path."
    echo "  -m <mode>       : Specify processing mode (e.g., 'fast', 'safe', 'default')."
    echo "  -h              : Display this help message."
    echo "  <input_file>    : Required input file path."
    # Exit with a non-zero status to indicate an error (often usage error).
    exit 1
}

# --- Argument Parsing using getopts ---
# `getopts` is a Bash built-in for parsing short options.
# The first argument to getopts is the option string.
#   Each character is an option letter.
#   A colon ':' after a letter means that option requires an argument (e.g., `o:`).
#   A leading colon ':' tells getopts to be silent about errors (invalid option, missing arg),
#   allowing custom error handling within the case statement.
# The second argument (`opt` here) is the variable name that `getopts` will put the parsed option letter into.
while getopts ":vo:m:h" opt; do
    # `case` statement checks the value of `$opt` for each processed option.
    case $opt in
        v)
            # Option -v was found (flag).
            VERBOSE=1
            ;;
        o)
            # Option -o was found, its argument is in `$OPTARG`.
            OUTPUT_FILE="$OPTARG"
            ;;
        m)
            # Option -m was found, its argument is in `$OPTARG`.
            MODE="$OPTARG"
            ;;
        h)
            # Option -h was found, call usage function.
            usage
            ;;
        \?) # Case for an invalid option (requires leading colon in optstring).
            # `$OPTARG` contains the invalid option character.
            echo "Invalid option: -$OPTARG" >&2 # Error messages to stderr
            usage
            ;;
        :) # Case for a missing option argument (requires leading colon AND colon after option in optstring).
           # `$OPTARG` contains the option character that is missing its argument.
            echo "Option -$OPTARG requires an argument." >&2
            usage
            ;;
    esac # End case statement.
done # End while loop.

# --- Positional Argument Handling ---
# `shift` removes processed options from the positional parameters ($1, $2, ...).
# `OPTIND` is the index of the next argument to be processed by getopts.
# `$((OPTIND - 1))` calculates how many arguments were processed as options.
shift $((OPTIND - 1))

# Check if the correct number of remaining positional arguments is present.
# `$#` holds the number of positional arguments.
if [ $# -ne 1 ]; then
    echo "Error: Exactly one input file is required." >&2
    usage
fi
# Assign the first remaining positional argument to INPUT_FILE.
INPUT_FILE="$1"

# --- Using the Parsed Values ---
echo "--- Configuration ---"
echo "Verbose: $VERBOSE"
# Parameter expansion: `${VARIABLE:-default}` uses "default" if VARIABLE is unset or null.
echo "Output File: '${OUTPUT_FILE:-Not Set}'"
echo "Mode: $MODE"
echo "Input File: $INPUT_FILE"
echo "---------------------"

# Example conditional logic based on parsed options.
if [ "$VERBOSE" -eq 1 ]; then
    echo "Verbose mode is enabled. Performing extra logging..."
    # Add verbose actions here, e.g., set -x
fi

# Check if OUTPUT_FILE has a non-zero length string.
if [ -n "$OUTPUT_FILE" ]; then
    echo "Output will be directed to: $OUTPUT_FILE"
    # Example: Redirect subsequent output
    # exec > "$OUTPUT_FILE" || { echo "Error: Cannot write to output file '$OUTPUT_FILE'" >&2; exit 1; }
else
    echo "Output will be directed to standard output."
fi

# Validate the mode if necessary
case "$MODE" in
    fast|safe|default)
        echo "Processing using '$MODE' mode."
        # Add mode-specific logic here
        ;;
    *)
        echo "Error: Invalid mode '$MODE'. Allowed modes: fast, safe, default." >&2
        exit 1
        ;;
esac

# Check if input file exists and is readable
if [[ ! -f "$INPUT_FILE" || ! -r "$INPUT_FILE" ]]; then
    echo "Error: Input file '$INPUT_FILE' does not exist or is not readable." >&2
    exit 1
fi

echo "Starting main processing of '$INPUT_FILE'..."
# --- Main script logic here --- 

echo "Script finished successfully."
exit 0 # Explicitly exit with success code