#!/usr/bin/env bash

yarn bundle

ls android/app/src/main/assets
cat android/app/src/main/assets/index.android.bundle
