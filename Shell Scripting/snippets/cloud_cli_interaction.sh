#!/bin/bash
set -euo pipefail

BUCKET_NAME="my-unique-app-bucket-$(date +%s)"
REGION="us-west-2"
TAG_KEY="Project"
TAG_VALUE="Phoenix"

echo "Checking if S3 bucket '$BUCKET_NAME' exists..."

if aws s3api get-bucket-tagging --bucket "$BUCKET_NAME" --region "$REGION" > /dev/null 2>&1; then
    echo "Bucket '$BUCKET_NAME' already exists."
    CURRENT_TAG_VALUE=$(aws s3api get-bucket-tagging --bucket "$BUCKET_NAME" --region "$REGION" \
                        --query "TagSet[?Key=='$TAG_KEY'].Value" --output text)
    if [[ "$CURRENT_TAG_VALUE" == "$TAG_VALUE" ]]; then
        echo "Bucket already has the correct '$TAG_KEY' tag: '$TAG_VALUE'."
    else
        echo "Bucket exists but tag '$TAG_KEY' is '$CURRENT_TAG_VALUE'. Updating..."
        aws s3api put-bucket-tagging --bucket "$BUCKET_NAME" --region "$REGION" \
            --tagging "{\"TagSet\":[{\"Key\":\"$TAG_KEY\",\"Value\":\"$TAG_VALUE\"}]}"
        echo "Tag updated."
    fi
else
    echo "Bucket '$BUCKET_NAME' does not exist or is not accessible. Creating..."
    aws s3api create-bucket --bucket "$BUCKET_NAME" --region "$REGION" \
        --create-bucket-configuration LocationConstraint="$REGION"
    echo "Bucket created. Applying tag..."
    aws s3api put-bucket-tagging --bucket "$BUCKET_NAME" --region "$REGION" \
        --tagging "{\"TagSet\":[{\"Key\":\"$TAG_KEY\",\"Value\":\"$TAG_VALUE\"}]}"
    echo "Tag applied."
fi

echo "Script finished."