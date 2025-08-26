#!/bin/bash

# Script to sync web assets with the native Android project.
# Since the web directory is now the project root ('.'), we only need to run 'cap sync'.

echo "===== LMSA Project Sync Tool ====="

echo "Syncing web assets with the Android project..."
# Syncs the web app content to the native Android project
npx cap sync android
echo "✓ Android project synced"
