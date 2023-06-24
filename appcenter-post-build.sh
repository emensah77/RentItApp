#!/usr/bin/env bash

[[ $APPCENTER_BRANCH = "staging" || $APPCENTER_BRANCH = "main" ]] && DEVICE_SET="release" || DEVICE_SET="development"

echo "Logging In\n"
appcenter login --password $APPCENTER_PASSWORD --user $APPCENTER_USER --quiet --version --debug
echo "Logged In\n"

echo "Generating Launch Test\n"
appcenter test generate appium --platform $PLATFORM --output-path $APPCENTER_SOURCE_DIRECTORY/chijioke --debug
echo "Generated Launch Test\n"

SOURCE_APK=$APPCENTER_SOURCE_DIRECTORY/android/app/build/outputs/apk/release/app-release.apk

npm install -g replace-in-file

replace-in-file "capabilities.setCapability(\"app\", \"/path/to/app.apk\");" "capabilities.setCapability(\"app\", \"$SOURCE_APK\");" $APPCENTER_SOURCE_DIRECTORY/chijioke/src/test/java/com/azure/mobile/app/test/LaunchTest.java --encoding=utf-8 --disableGlobs true

cd $APPCENTER_SOURCE_DIRECTORY/chijioke

echo "Starting Run\n"
appcenter test run appium --app "Photizo/Rentit-Android-Production" --devices "Photizo/$DEVICE_SET" --app-path $APPCENTER_SOURCE_DIRECTORY/android/app/build/outputs/apk/release/app-release.apk --test-series "launch-tests" --locale "en_US" --build-dir $APPCENTER_SOURCE_DIRECTORY/chijioke/target/upload --token $APPCENTER_CLI_TOKEN --debug
echo "Completed Run"
