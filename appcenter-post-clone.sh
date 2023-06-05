#!/usr/bin/env bash

cat << EOF > $APPCENTER_SOURCE_DIRECTORY/android/app/src/main/assets/appcenter-config.json
  ${{ APPCENTER_CONFIG }}
EOF

cd $APPCENTER_SOURCE_DIRECTORY/android/app/src/main/assets/appcenter-config.json
ls -lSA 
