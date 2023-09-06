#!/usr/bin/env bash

if [[ $PLATFORM = "ios" ]]
then
  yarn bundle:macos
else
  yarn bundle:win32
fi
