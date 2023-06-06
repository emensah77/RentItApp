#!/usr/bin/env bash

# Create App Center config
cat << EOF > $APPCENTER_SOURCE_DIRECTORY/android/app/src/main/assets/appcenter-config.json
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
