#!/bin/bash
# Enable strict mode.
set -euo pipefail

# --- Configuration ---
# Define variables for bucket name, region, and tags.
# Generating a unique bucket name using timestamp (adjust as needed).
# Note: Bucket names must be globally unique.
BUCKET_NAME="my-unique-app-bucket-$(date +%s)-${RANDOM}"
REGION="us-west-2" # Example region, change if necessary
TAG_KEY="Project"
TAG_VALUE="Phoenix"

echo "Configuration:"
echo "  Bucket: $BUCKET_NAME"
echo "  Region: $REGION"
echo "  Tag:    $TAG_KEY=$TAG_VALUE"

# --- Check AWS CLI Availability ---
if ! command -v aws &> /dev/null; then
    echo "Error: AWS CLI is not installed or not in PATH. Please install it." >&2
    exit 1
fi
echo "AWS CLI found."

# --- Check Bucket Existence and Tags ---
echo "\nChecking S3 bucket '$BUCKET_NAME' existence and tags in region '$REGION'..."

# Attempt to get the bucket tagging. This serves two purposes:
# 1. Checks if the bucket exists and is accessible (otherwise it errors).
# 2. Retrieves existing tags if successful.
# `> /dev/null 2>&1` redirects both stdout and stderr to null, suppressing output
# We only care about the exit status (0 for success, non-zero for failure/doesn't exist).
if aws s3api get-bucket-tagging --bucket "$BUCKET_NAME" --region "$REGION" > /dev/null 2>&1; then
    # Bucket exists and is accessible.
    echo "Bucket '$BUCKET_NAME' already exists."
    
    # Retrieve the specific tag value using JMESPath query.
    # `--query "TagSet[?Key=='$TAG_KEY'].Value"`: Filters the TagSet array for the element where Key equals TAG_KEY, and returns its Value.
    # `--output text`: Outputs the result as plain text without JSON quotes.
    echo "Checking for tag '$TAG_KEY'..."
    CURRENT_TAG_VALUE=$(aws s3api get-bucket-tagging --bucket "$BUCKET_NAME" --region "$REGION" \
                        --query "TagSet[?Key=='$TAG_KEY'].Value" --output text 2>/dev/null || true)
                        # Added `|| true` and stderr redirection to handle cases where the tag doesn't exist gracefully

    # Compare the retrieved tag value with the desired value.
    if [[ "$CURRENT_TAG_VALUE" == "$TAG_VALUE" ]]; then
        echo "Bucket already has the correct '$TAG_KEY' tag: '$TAG_VALUE'. No action needed."
    else
        # Tag exists but has wrong value, or tag does not exist (CURRENT_TAG_VALUE is empty).
        echo "Bucket exists but tag '$TAG_KEY' is currently '${CURRENT_TAG_VALUE:-Not Set}'. Updating/Applying tag..."
        # Use put-bucket-tagging to set the desired tag (this overwrites *all* existing tags).
        # The `--tagging` argument expects a JSON string.
        aws s3api put-bucket-tagging --bucket "$BUCKET_NAME" --region "$REGION" \
            --tagging "{\"TagSet\":[{\"Key\":\"$TAG_KEY\",\"Value\":\"$TAG_VALUE\"}]}" 
        echo "Tag applied/updated."
    fi
else
    # Bucket does not exist or is not accessible (permission error).
    echo "Bucket '$BUCKET_NAME' does not exist or is not accessible. Attempting to create..."
    # Create the bucket.
    # `--create-bucket-configuration LocationConstraint=$REGION` is required for regions other than us-east-1.
    aws s3api create-bucket --bucket "$BUCKET_NAME" --region "$REGION" \
        --create-bucket-configuration LocationConstraint="$REGION"
    
    # Check if bucket creation was successful (Optional: Could add wait logic here).
    echo "Bucket created. Applying tag '$TAG_KEY=$TAG_VALUE'..."
    # Apply the tag to the newly created bucket.
    aws s3api put-bucket-tagging --bucket "$BUCKET_NAME" --region "$REGION" \
        --tagging "{\"TagSet\":[{\"Key\":\"$TAG_KEY\",\"Value\":\"$TAG_VALUE\"}]}"
    echo "Tag applied."
fi

# --- Optional: Cleanup ---
# echo "\nOptional: Deleting bucket '$BUCKET_NAME' for cleanup..."
# aws s3api delete-bucket --bucket "$BUCKET_NAME" --region "$REGION"
# echo "Cleanup complete."

echo "\nScript finished."