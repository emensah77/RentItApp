#!/usr/bin/env bash

cat << EOF > $APPCENTER_SOURCE_DIRECTORY/android/app/src/main/assets/appcenter-config.json
  NEXT_PUBLIC_NODE_ENV=${{ APPCENTER_CONFIG }}
EOF
