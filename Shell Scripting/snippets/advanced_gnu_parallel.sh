#!/bin/bash
# Enable strict mode:
# -e: Exit immediately if a command exits with a non-zero status.
# -u: Treat unset variables as an error when substituting.
# -o pipefail: The return value of a pipeline is the status of the last command to exit with a non-zero status, or zero if no command exited with a non-zero status.
set -euo pipefail

# --- Example 1: Combining inputs from two lists/files ---
echo "Running command with linked inputs from two files..."
# `--link`: Processes arguments from multiple input sources simultaneously.
# `{1}` refers to the first input source (params1.txt).
# `{2}` refers to the second input source (params2.txt).
# `::::` indicates file input sources.
# Note: Ensure params1.txt and params2.txt exist and have the same number of lines for `--link`.
# echo "paramA1" > params1.txt; echo "paramA2" >> params1.txt
# echo "paramB1" > params2.txt; echo "paramB2" >> params2.txt
parallel --link echo "Processing {1} with {2}" :::: params1.txt :::: params2.txt
# rm params1.txt params2.txt # Cleanup for demo

# --- Example 2: Grouping output based on input ---
echo "\nCreating dummy input files..."
# Create some dummy files for demonstration.
echo "data1" > input_a.txt
echo "data2" > input_b.txt
echo "data3" > input_c.txt

echo "Processing files, grouping output..."
# `{.}` is a replacement string that takes the input line ({}) and removes the extension.
# This command simulates processing each input file and redirecting its specific output to a log file named after the input (e.g., input_a.log).
# Note: The '>' needs to be quoted or escaped so the shell doesn't interpret it before parallel does.
parallel echo "Simulating processing of {}" ">" {.}.log ::: input_*.txt

# Cleanup demo files
echo "Cleaning up input/output files..."
rm input_*.txt *.log

# --- Example 3: Reading specific columns from a file ---
echo "\nCreating dummy CSV file..."
# Create a sample CSV file.
echo "Name,Value1,Value2" > data.csv
echo "alpha,10,100" >> data.csv
echo "beta,20,200" >> data.csv

echo "Processing specific columns from CSV..."
# `tail -n +2`: Skips the header row.
# `--colsep ','`: Specifies the column separator for input processing.
# `{1}` refers to the first column.
# `{3}` refers to the third column.
# The input is piped from `tail` to `parallel`.
tail -n +2 data.csv | parallel --colsep ',' echo "Got Name={1}, Value2={3}"

# Cleanup
echo "Cleaning up CSV..."
rm data.csv

echo "\nGNU Parallel examples finished."