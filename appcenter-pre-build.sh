#!/usr/bin/env bash

# For Android
if [ -f "$APPCENTER_SOURCE_DIRECTORY/android/app/build.gradle" ]; then
    echo "Incrementing versionCode for Android..."
    sed -i.bak '/versionCode/s/[0-9]\+/&+1/' $APPCENTER_SOURCE_DIRECTORY/android/app/build.gradle
    rm $APPCENTER_SOURCE_DIRECTORY/android/app/build.gradle.bak
    echo "Incrementing versionName for Android..."
    # This assumes a versioning style of x.x.x - adjust if necessary
    awk -F'"' '/versionName/ {split($2, a, "."); a[3]++; $2=a[1]"."a[2]"."a[3]; print $0; next}1' $APPCENTER_SOURCE_DIRECTORY/android/app/build.gradle > tmpfile && mv tmpfile $APPCENTER_SOURCE_DIRECTORY/android/app/build.gradle

    # Log the content of build.gradle after changes
    echo "Content of build.gradle after incrementing:"
    cat $APPCENTER_SOURCE_DIRECTORY/android/app/build.gradle
    echo "End of build.gradle content."

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
