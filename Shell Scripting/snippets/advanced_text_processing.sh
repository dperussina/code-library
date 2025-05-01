#!/bin/bash
set -euo pipefail

# --- Example 1: Process CSV with awk ---
echo "Processing CSV file with awk..."
awk -F',' 'NR > 1 {
    sum[$2] += $3;
    count[$2]++;
}
END {
    print "Category,TotalValue,Count,AverageValue";
    for (cat in sum) {
        average = sum[cat] / count[cat];
        printf "%s,%.2f,%d,%.2f\n", cat, sum[cat], count[cat], average;
    }
}' data.csv

# --- Example 2: Replace text with sed ---
echo "Replacing 'Error' with 'Warning' in log files..."
LOG_DIR="./logs"
PATTERN="error_report_*.log"
find "$LOG_DIR" -maxdepth 1 -type f -name "$PATTERN" -print0 | \
    xargs -0 -r sed -i.bak 's/Error/Warning/gi'
echo "Replacement complete."

# --- Example 3: Join files with join ---
echo "Joining sorted files..."
sort -t',' -k1,1 file1.txt -o file1.sorted.txt
sort -t',' -k1,1 file2.txt -o file2.sorted.txt
join -t',' -1 1 -2 1 -a 1 -o 0,1.2,1.3,2.2 file1.sorted.txt file2.sorted.txt > joined_output.txt
echo "Join complete. Output in joined_output.txt."