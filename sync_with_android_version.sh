#!/bin/bash

# Sync web files to the www directory (for Capacitor)
rsync -a --delete index.html css js icon.png www/

# Sync web files to Android project's assets directory
npx cap sync android
