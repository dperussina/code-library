#!/bin/bash
# Enable strict mode (optional but good practice).
# set -euo pipefail

# --- Sample Variables ---
FILENAME="/path/to/report_2025-04-28_final.csv.gz"
URL="https://example.com/data/archive?user=test&pass=secret"
EMPTY_VAR=""
SET_VAR="actual_value"

echo "Original Filename: $FILENAME"

# --- Substring Removal (Suffix) ---
# `${variable%pattern}`: Remove shortest matching suffix pattern.
# `${variable%%pattern}`: Remove longest matching suffix pattern.
echo "1. Basename (remove longest prefix */): ${FILENAME##*/}"
echo "2. Remove shortest suffix .*: ${FILENAME%.*}"
echo "3. Remove longest suffix .*: ${FILENAME%%.*}"
echo "4. Remove specific suffix .gz: ${FILENAME%.gz}"
echo "5. Remove specific suffix .csv.gz: ${FILENAME%.csv.gz}"

# --- Substring Removal (Prefix) ---
# `${variable#pattern}`: Remove shortest matching prefix pattern.
# `${variable##pattern}`: Remove longest matching prefix pattern.
echo "6. Remove shortest prefix */: ${FILENAME#*/}"
echo "7. Remove longest prefix */: ${FILENAME##*/}" # Same as basename
echo "8. Directory path (remove shortest suffix /*): ${FILENAME%/*}"

# --- Substring Replacement ---
# `${variable/pattern/string}`: Replace first match of pattern with string.
# `${variable//pattern/string}`: Replace all matches of pattern with string.
echo "9. Replace first '_' with '-': ${FILENAME/_/-}"
echo "10. Replace all '_' with '-': ${FILENAME//_/-}"
echo "11. Replace 'final' with 'draft': ${FILENAME/final/draft}"

# --- Substring Extraction (Slicing) ---
# `${variable:offset:length}`: Extract substring starting at offset for length characters.
echo "12. Extract 10 chars from offset 7: ${FILENAME:7:10}" # Example: Extract date part if fixed position

# --- Default Values ---
# `${variable:-word}`: If variable is unset or null, use word. Otherwise use variable.
echo "13. Default for EMPTY_VAR: ${EMPTY_VAR:-'default_value'}"
echo "14. Default for UNSET_VAR: ${UNSET_VAR:-'using default'}"
# `${variable:=word}`: If variable is unset or null, assign word to variable AND use word. Otherwise use variable.
DEFAULT_ASSIGN=${UNSET_ASSIGN:='assigned_default'}
echo "15. Assigned default for UNSET_ASSIGN: $DEFAULT_ASSIGN (variable is now set)"
echo "16. UNSET_ASSIGN is now: $UNSET_ASSIGN"

# --- Alternative Value ---
# `${variable:+word}`: If variable is set and not null, use word. Otherwise use null string.
echo "17. Alternative for SET_VAR: ${SET_VAR:+'is set, use this'}"
echo "18. Alternative for EMPTY_VAR: ${EMPTY_VAR:+'is set, use this'}" # Outputs nothing
echo "19. Alternative for UNSET_VAR: ${UNSET_VAR:+'is set, use this'}" # Outputs nothing

# --- Indirect Expansion --- (Use with caution)
# `${!prefix*}` or `${!prefix@}`: Expands to list of variable names starting with prefix.
PREFIX_VAR_A="apple"
PREFIX_VAR_B="banana"
echo "20. Variables starting with PREFIX_VAR_: ${!PREFIX_VAR_*}"

echo "\nParameter expansion examples finished."