#!/bin/bash

FILENAME="report_2025-04-28_final.csv.gz"
URL="https://example.com/data/archive?user=test&pass=secret"

echo "Basename: ${FILENAME##*/}"
echo "Without .gz: ${FILENAME%.gz}"
echo "Without .csv.gz: ${FILENAME%.csv.gz}"

NEW_FILENAME_1="${FILENAME/final/draft}"
echo "Replaced 'final': $NEW_FILENAME_1"

NEW_FILENAME_2="${FILENAME//_/-}"
echo "Replaced all '_': $NEW_FILENAME_2"

DATE_PART="${FILENAME:7:10}"
echo "Date part: $DATE_PART"

UNSET_VAR=""
DEFAULT_VAL="${UNSET_VAR:-'default_value'}"
echo "Default value: $DEFAULT_VAL"

SET_VAR="actual_value"
ALTERNATIVE_VAL="${SET_VAR:+'alternative_if_set'}"
echo "Alternative when set: $ALTERNATIVE_VAL"