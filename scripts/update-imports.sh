#!/bin/bash

# Update all UI component imports
find . -type f -name "*.tsx" -exec sed -i '' 's|@/components/ui/|@/components/core/|g' {} +

# Update any remaining UI component imports in TS files
find . -type f -name "*.ts" -exec sed -i '' 's|@/components/ui/|@/components/core/|g' {} +

echo "Updated all component imports from ui/ to core/" 