#!/bin/bash

# Combined script to sync JS files, web files and sync with Android

echo "===== LMSA Project Sync Tool ====="

echo "Step 1: Syncing JS files to www directory..."
# Copy all JS files from js/ to www/js/
cp -f js/*.js www/js/
echo "✓ JS files synced"

echo "Step 2: Syncing all web files to www directory..."
# Sync web files to the www directory (for Capacitor)
rsync -a --delete index.html css js icon.png www/
echo "✓ Web files synced to www/"

echo "Step 3: Syncing with Android project..."
# Sync web files to Android project's assets directory
npx cap sync android
echo "✓ Android project synced"

echo "===== All sync operations completed successfully! ====="
