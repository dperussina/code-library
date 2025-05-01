#!/bin/bash
# Enable strict mode.
set -euo pipefail

# --- Configuration ---
# Define the target API endpoint.
API_ENDPOINT="https://httpbin.org/post" # httpbin.org is useful for testing HTTP requests.
# Define authentication token (replace with actual token or secure retrieval method).
AUTH_TOKEN="your_secret_token_here"

# --- Payload Construction (using jq) ---
echo "Constructing JSON payload using jq..."
# Use jq to safely create a JSON string.
# `-n`: Read null input (don't read from stdin).
# `--arg name "Gadget"`: Defines a jq variable `name` with the value "Gadget".
# `--arg quantity 5`: Defines a jq variable `quantity` with the value 5 (jq handles type).
# `{ ... }`: Creates a JSON object using the variables.
JSON_PAYLOAD=$(jq -n --arg name "Gadget" --arg quantity 5 \
  '{ "item_name": $name, "qty": $quantity, "options": ["red", "large"] }')

echo "Sending POST request to $API_ENDPOINT..."
echo "Payload: $JSON_PAYLOAD"

# --- Send POST Request (using curl) ---
# Use curl to send the HTTP request.
# `-s`: Silent mode (suppress progress meter and errors).
# `-X POST`: Specify the request method as POST.
# `-H 'Content-Type: application/json'`: Set the Content-Type header for JSON data.
# `-H "Authorization: Bearer $AUTH_TOKEN"`: Set the Authorization header (Bearer token scheme).
# `-d "$JSON_PAYLOAD"`: Send the JSON payload as the request body.
# `"$API_ENDPOINT"`: The URL to send the request to.
RESPONSE=$(curl -s -X POST \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d "$JSON_PAYLOAD" \
  "$API_ENDPOINT")

# Check curl exit status (optional but recommended)
if [[ $? -ne 0 ]]; then
  echo "Error: curl command failed." >&2
  exit 1
fi

# --- Process Response (using jq) ---
echo "\n--- Raw Response ---"
echo "$RESPONSE"
echo "--------------------"

echo "\nProcessing response with jq..."
# Use jq to parse the JSON response and extract specific fields.
# `-r`: Raw output (removes quotes from strings).
# `.json.item_name`: Access nested fields (httpbin echoes the sent JSON under the 'json' key).
# `.json.options[0]`: Access the first element of the 'options' array.
# `.headers."X-Forwarded-For" // .origin`: Try to get the X-Forwarded-For header, otherwise fall back to the origin IP.
ITEM_NAME=$(echo "$RESPONSE" | jq -r '.json.item_name')
FIRST_OPTION=$(echo "$RESPONSE" | jq -r '.json.options[0]')
ORIGIN_IP=$(echo "$RESPONSE" | jq -r '.headers."X-Forwarded-For" // .origin')

# Check jq exit status after each extraction (optional)
if [[ $? -ne 0 ]]; then
  echo "Error: jq command failed while processing the response." >&2
  # Decide whether to exit or continue with potentially missing values
fi

# --- Output Extracted Data ---
echo "\n--- Extracted Data ---"
echo "Item Name: $ITEM_NAME"
echo "First Option: $FIRST_OPTION"
echo "Origin IP: $ORIGIN_IP"
echo "----------------------"

echo "\nAdvanced web interaction demo finished."