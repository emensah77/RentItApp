#!/usr/bin/env bash

# ln -sf $APPCENTER_SOURCE_DIRECTORY/node_modules/@sentry/cli/bin/sentry-cli $APPCENTER_SOURCE_DIRECTORY/node_modules/@sentry/cli/sentry-cli

# ls -lSA $APPCENTER_SOURCE_DIRECTORY/node_modules/@sentry
# echo "\n\n\n\n\n\n"

node $APPCENTER_SOURCE_DIRECTORY/node_modules/@sentry/cli/scripts/install.js
# cp -af $APPCENTER_SOURCE_DIRECTORY/node_modules/@sentry/cli/. $APPCENTER_SOURCE_DIRECTORY/node_modules/@sentry/
# cp -f $APPCENTER_SOURCE_DIRECTORY/node_modules/@sentry/cli/bin/sentry-cli $APPCENTER_SOURCE_DIRECTORY/node_modules/@sentry/cli/sentry-cli

# echo "\n\n\n\n\n\n"
# ls -lSA $APPCENTER_SOURCE_DIRECTORY/node_modules/@sentry
