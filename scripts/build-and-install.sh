
#!/bin/bash
set -e

# Build the application
npm run make

# Locate the generated macOS application
APP_PATH=$(find out -maxdepth 2 -name "*.app" -type d | head -n 1)

if [ -z "$APP_PATH" ]; then
  echo "Application not found"
  exit 1
fi

APP_NAME=$(basename "$APP_PATH")
DESTINATION="/Applications/$APP_NAME"

# Close the installed application if running
osascript -e "tell application \"${APP_NAME%.app}\" to quit" 2>/dev/null || true

# Replace the installed application
rm -rf "$DESTINATION"
ditto "$APP_PATH" "$DESTINATION"

echo "Installed: $DESTINATION"
