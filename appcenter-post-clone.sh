#!/usr/bin/env bash

# Create Android App Center config json
cat << EOF > $APPCENTER_SOURCE_DIRECTORY/android/app/src/main/assets/appcenter-config.json
  $APPCENTER_CONFIG
EOF

# Create iOS' App Center config plist file
cat << EOF > $APPCENTER_SOURCE_DIRECTORY/ios/AppCenter-Config.plist
  $APPCENTER_CONFIG
EOF

# Create test environment variables
cat << EOF > $APPCENTER_SOURCE_DIRECTORY/.env.test
  REACT_NATIVE_APP_ENV=test
EOF

# Create release environment variables
cat << EOF > $APPCENTER_SOURCE_DIRECTORY/.env
  REACT_NATIVE_APP_ENV=$REACT_NATIVE_APP_ENV
EOF
