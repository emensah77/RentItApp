#!/usr/bin/env bash

# ln -sf $APPCENTER_SOURCE_DIRECTORY/node_modules/@sentry/cli/bin/sentry-cli $APPCENTER_SOURCE_DIRECTORY/node_modules/@sentry/cli/sentry-cli

cp -a $APPCENTER_SOURCE_DIRECTORY/node_modules/@sentry/cli/. $APPCENTER_SOURCE_DIRECTORY/node_modules/@sentry/
cp -a $APPCENTER_SOURCE_DIRECTORY/node_modules/@sentry/cli/bin/sentry-cli $APPCENTER_SOURCE_DIRECTORY/node_modules/@sentry/cli/sentry-cli
