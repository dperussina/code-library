#!/bin/bash
set -euo pipefail

API_ENDPOINT="https://httpbin.org/post"
AUTH_TOKEN="your_secret_token_here"

# Construct JSON payload
JSON_PAYLOAD=$(jq -n --arg name "Gadget" --arg quantity 5 \
  '{ "item_name": $name, "qty": $quantity, "options": ["red", "large"] }')

echo "Sending POST request to $API_ENDPOINT"
echo "Payload: $JSON_PAYLOAD"

# Send POST request
RESPONSE=$(curl -s -X POST \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d "$JSON_PAYLOAD" \
  "$API_ENDPOINT")

echo "--- Raw Response ---"
echo "$RESPONSE"
echo "---"

# Process response with jq
ITEM_NAME=$(echo "$RESPONSE" | jq -r '.json.item_name')
FIRST_OPTION=$(echo "$RESPONSE" | jq -r '.json.options[0]')
ORIGIN_IP=$(echo "$RESPONSE" | jq -r '.headers."X-Forwarded-For" // .origin')

echo "Item Name: $ITEM_NAME"
echo "First Option: $FIRST_OPTION"
echo "Origin IP: $ORIGIN_IP"