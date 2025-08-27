#!/bin/bash

# Script to sync web assets with the native Android project.
# Syncs root files to www/ directory, then syncs with Android project.

echo "===== LMSA Project Sync Tool ====="

echo "Syncing root files to www/ directory..."
# Sync root web assets to www/ directory (excluding Android build files)
rsync -av --exclude='android/' --exclude='node_modules/' --exclude='.git/' --exclude='www/' ./ www/
echo "✓ Root files synced to www/"

echo "Syncing web assets with the Android project..."
# Syncs the web app content to the native Android project
npx cap sync android
echo "✓ Android project synced"
