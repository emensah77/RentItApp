#!/usr/bin/env bash

# For Android
if [ -f "$APPCENTER_SOURCE_DIRECTORY/android/app/build.gradle" ]; then
    echo "Incrementing versionCode for Android..."
    sed -i '/versionCode/s/[0-9]\+/&+1/' $APPCENTER_SOURCE_DIRECTORY/android/app/build.gradle
    echo "Incrementing versionName for Android..."
    # This assumes a versioning style of x.x.x - adjust if necessary
    awk -F. -v OFS=. '/versionName/ {$NF++; print}' $APPCENTER_SOURCE_DIRECTORY/android/app/build.gradle > tmpfile && mv tmpfile $APPCENTER_SOURCE_DIRECTORY/android/app/build.gradle
fi

# For iOS
if [ -f "$APPCENTER_SOURCE_DIRECTORY/ios/AirbnbClone/Info.plist" ]; then
    echo "Incrementing CFBundleVersion for iOS..."
    /usr/libexec/PlistBuddy -c "Set :CFBundleVersion $((`/usr/libexec/PlistBuddy -c "Print :CFBundleVersion" $APPCENTER_SOURCE_DIRECTORY/ios/AirbnbClone/Info.plist` + 1))" $APPCENTER_SOURCE_DIRECTORY/ios/AirbnbClone/Info.plist
fi

# Existing prebuild logic
if [[ $PLATFORM = "ios" ]]
then
  yarn bundle:macos
else
  yarn bundle:win32
fi
