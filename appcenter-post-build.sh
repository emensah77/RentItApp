#!/usr/bin/env bash

[[ $APPCENTER_BRANCH = "staging" || $APPCENTER_BRANCH = "main" ]] && DEVICE_SET="release" || DEVICE_SET="development"

appcenter login --password $APPCENTER_PASSWORD --user $APPCENTER_USER --quiet --version

appcenter test generate appium --platform $PLATFORM --output-path $APPCENTER_SOURCE_DIRECTORY/chijioke

SOURCE_APK=$APPCENTER_SOURCE_DIRECTORY/android/app/build/outputs/apk/release/app-release.apk

echo $SOURCE_APK;

npm install -g replace-in-file

cat $APPCENTER_SOURCE_DIRECTORY/chijioke/src/test/java/com/azure/mobile/app/test/LaunchTest.java

replace-in-file "capabilities.setCapability(\"app\", \"/path/to/app.apk\");" "capabilities.setCapability(\"app\", \"$SOURCE_APK\");" $APPCENTER_SOURCE_DIRECTORY/chijioke/src/test/java/com/azure/mobile/app/test/LaunchTest.java --encoding=utf-8 --disableGlobs true

# mkdir /path
# mkdir /path/to
# cp $SOURCE_APK /path/to/app.apk
cd $APPCENTER_SOURCE_DIRECTORY/chijioke

appcenter test run appium --app "Photizo/Rentit-Android-Production" --devices "Photizo/$DEVICE_SET" --app-path $APPCENTER_SOURCE_DIRECTORY/android/app/build/outputs/apk/release/app-release.apk --test-series "launch-tests" --locale "en_US" --build-dir $APPCENTER_SOURCE_DIRECTORY/chijioke/target/upload
