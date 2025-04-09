#!/bin/bash

# Create temporary file
tmp_file=$(mktemp)

# Read the original file
cat client/src/pages/post-property-free.tsx > "$tmp_file"

# Replace all image/* entries with proper image types array
sed -i 's/accepts={\["image\/\*"\]}/accepts={["image\/jpeg", "image\/png", "image\/jpg", "image\/webp"]}/g' "$tmp_file"

# Replace video/* with proper video types array
sed -i 's/accepts={\["video\/\*"\]}/accepts={["video\/mp4", "video\/mpeg", "video\/webm", "video\/quicktime"]}/g' "$tmp_file"

# Copy modified content back to original file
cat "$tmp_file" > client/src/pages/post-property-free.tsx

# Clean up
rm "$tmp_file"

echo "All accepts parameters have been updated"
