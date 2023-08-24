#!/usr/bin/env bash

if [[ $PLATFORM = "ios" ]]
then
  yarn bundle:macos
else
  yarn bundle:win32
fi

ls android/app/src/main/assets
cat android/app/src/main/assets/index.android.bundle
