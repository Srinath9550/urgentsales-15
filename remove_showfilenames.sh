#!/bin/bash

# Create temporary file
tmp_file=$(mktemp)

# Read the original file
cat client/src/pages/post-property-free.tsx > "$tmp_file"

# Remove showFileNames prop
sed -i 's/showFileNames={true}//' "$tmp_file"

# Copy modified content back to original file
cat "$tmp_file" > client/src/pages/post-property-free.tsx

# Clean up
rm "$tmp_file"

echo "Removed showFileNames prop from all FileUpload components"
