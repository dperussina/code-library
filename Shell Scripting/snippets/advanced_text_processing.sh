#!/bin/bash
# Enable strict mode for safety.
set -euo pipefail

# --- Preparation: Create dummy files for examples ---
echo "Creating dummy files for processing..."
# For awk example
echo "ID,Category,Value" > data.csv
echo "1,Alpha,10.5" >> data.csv
echo "2,Beta,20.0" >> data.csv
echo "3,Alpha,15.5" >> data.csv
echo "4,Gamma,30.0" >> data.csv
echo "5,Beta,25.0" >> data.csv

# For sed example
LOG_DIR="./logs"
mkdir -p "$LOG_DIR"
echo "Error: Critical failure on server1" > "$LOG_DIR/error_report_01.log"
echo "Error: Minor issue on server2" > "$LOG_DIR/error_report_02.log"
echo "Info: Service started" > "$LOG_DIR/info_01.log"

# For join example
echo "key1,val1a,val1b" > file1.txt
echo "key2,val2a,val2b" >> file1.txt
echo "key3,val3a,val3b" >> file1.txt
echo "key2,extra2a" > file2.txt
echo "key3,extra3a" >> file2.txt
echo "key4,extra4a" >> file2.txt
echo "Preparation complete."

# --- Example 1: Process CSV with awk ---
echo "\nProcessing CSV file with awk to calculate category sums and averages..."
# awk is a powerful text processing tool, ideal for structured data like CSV.
# -F',': Sets the field separator to a comma.
# 'NR > 1': Executes the following block only for record numbers (lines) greater than 1 (skips header).
# `sum[$2] += $3`: Accumulates the value in column 3 ($3) into an associative array `sum`, indexed by the category in column 2 ($2).
# `count[$2]++`: Increments the count for each category in the `count` array.
# END block: Executed after all lines are processed.
#   Prints a header.
#   Iterates through the categories found (keys in the `sum` array).
#   Calculates the average.
#   Uses printf for formatted output.
awk -F',' 'NR > 1 { sum[$2] += $3; count[$2]++; } END { print "Category,TotalValue,Count,AverageValue"; for (cat in sum) { average = sum[cat] / count[cat]; printf "%s,%.2f,%d,%.2f\n", cat, sum[cat], count[cat], average; } }' data.csv

# --- Example 2: Replace text with sed ---
echo "\nReplacing 'Error' with 'Warning' in log files using find and sed..."
# Use find to locate files matching the pattern in the specified directory.
# `-maxdepth 1`: Prevents find from descending into subdirectories.
# `-type f`: Finds only files.
# `-name "$PATTERN"`: Matches the filename pattern.
# `-print0`: Prints the found filenames separated by a null character, safer for filenames with spaces/special chars.
# Use xargs to pass the filenames to sed.
# `-0`: Reads null-separated input (matches find -print0).
# `-r`: (GNU xargs) Avoids running sed if find returns no files.
# `sed -i.bak 's/Error/Warning/gi'`: Edits files in-place (`-i`), creating backups with `.bak` extension.
#   `s/Error/Warning/gi`: Substitution command.
#     `s`: Substitute.
#     `/Error/`: The pattern to find.
#     `/Warning/`: The replacement string.
#     `g`: Global (replace all occurrences on a line, not just the first).
#     `i`: Case-insensitive matching.
PATTERN="error_report_*.log"
find "$LOG_DIR" -maxdepth 1 -type f -name "$PATTERN" -print0 | \
    xargs -0 -r sed -i.bak 's/Error/Warning/gi'

echo "Replacement complete. Check files in $LOG_DIR (originals have .bak extension)."

# --- Example 3: Join files based on a common field ---
echo "\nJoining sorted files based on the first column..."
# `join` works on lines with identical join fields (columns).
# Input files MUST be sorted on the join field.
# `sort -t',' -k1,1`: Sorts based on the first field (`-k1,1`), using comma as delimiter (`-t','`).
# `-o file.sorted.txt`: Writes sorted output to a file.
sort -t',' -k1,1 file1.txt -o file1.sorted.txt
sort -t',' -k1,1 file2.txt -o file2.sorted.txt

# `join -t','`: Specifies comma as delimiter for input and output.
# `-1 1`: Join on field 1 of file1.
# `-2 1`: Join on field 1 of file2.
# `-a 1`: Include unpairable lines from file1 (like a left outer join).
# `-o 0,1.2,1.3,2.2`: Specifies the output format.
#   `0`: The join field (common key).
#   `1.2`: Field 2 from file1.
#   `1.3`: Field 3 from file1.
#   `2.2`: Field 2 from file2.
join -t',' -1 1 -2 1 -a 1 -o '0,1.2,1.3,2.2' file1.sorted.txt file2.sorted.txt > joined_output.txt
echo "Join complete. Output in joined_output.txt."

# --- Cleanup ---
echo "\nCleaning up dummy files..."
rm data.csv
rm -rf "$LOG_DIR"
rm file1.txt file2.txt file1.sorted.txt file2.sorted.txt joined_output.txt
echo "Cleanup complete."