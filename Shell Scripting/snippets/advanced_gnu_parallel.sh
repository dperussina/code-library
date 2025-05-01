#!/bin/bash
set -euo pipefail

# --- Example 1: Combining inputs from two lists/files ---
echo "Running command with linked inputs from two files..."
parallel --link echo "Processing {1} with {2}" :::: params1.txt :::: params2.txt

# --- Example 2: Grouping output based on input ---
echo "Creating dummy input files..."
echo "data1" > input_a.txt
echo "data2" > input_b.txt
echo "data3" > input_c.txt

echo "Processing files, grouping output..."
parallel echo "Simulating processing of {}" ">" {.}.log ::: input_*.txt

# Cleanup demo files
echo "Cleaning up..."
rm input_*.txt output_*.log

# --- Example 3: Reading specific columns from a file ---
echo "Name,Value1,Value2" > data.csv
echo "alpha,10,100" >> data.csv
echo "beta,20,200" >> data.csv

echo "Processing specific columns from CSV..."
tail -n +2 data.csv | parallel --colsep ',' echo "Got Name={1}, Value2={3}"

# Cleanup
echo "Cleaning up CSV..."
rm data.csv