#!/usr/bin/env bash

echo "$NODE_BINARY" $NODE_ARGS "$CLI_PATH" $BUNDLE_COMMAND \
  $CONFIG_ARG \
  --entry-file "$ENTRY_FILE" \
  --platform "$BUNDLE_PLATFORM" \
  --dev $DEV \
  --reset-cache \
  --bundle-output "$BUNDLE_FILE" \
  --assets-dest "$DEST" \
  $EXTRA_ARGS \
  $EXTRA_PACKAGER_ARGS

# Create Android App Center config json file
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
CODE_PUSH_DEPLOYMENT_KEY=$CODE_PUSH_DEPLOYMENT_KEY
EOF

# Create release environment variables
cat << EOF > $APPCENTER_SOURCE_DIRECTORY/.env
REACT_NATIVE_APP_ENV=$REACT_NATIVE_APP_ENV
CODE_PUSH_DEPLOYMENT_KEY=$CODE_PUSH_DEPLOYMENT_KEY
EOF
