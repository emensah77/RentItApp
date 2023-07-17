#!/usr/bin/env bash
cd $APPCENTER_SOURCE_DIRECTORY

echo "\n--------------------------------------------\nMain JSBundle"
cat /Users/runner/Library/Developer/Xcode/DerivedData/AirbnbClone-gbbroiutnhvueyfpqbsbqhpycdzy/Build/Intermediates.noindex/ArchiveIntermediates/AirbnbClone/BuildProductsPath/Release-iphoneos/main.jsbundle

echo "\n--------------------------------------------\nAirbnbClone.app:"
cat /Users/runner/Library/Developer/Xcode/DerivedData/AirbnbClone-gbbroiutnhvueyfpqbsbqhpycdzy/Build/Intermediates.noindex/ArchiveIntermediates/AirbnbClone/BuildProductsPath/Release-iphoneos/AirbnbClone.app

echo "\n--------------------------------------------\nmain.jsbundle.map:"
cat /Users/runner/Library/Developer/Xcode/DerivedData/AirbnbClone-gbbroiutnhvueyfpqbsbqhpycdzy/Build/Intermediates.noindex/ArchiveIntermediates/AirbnbClone/IntermediateBuildFilesPath/AirbnbClone.build/Release-iphoneos/AirbnbClone.build/DerivedSources/main.jsbundle.map


if [[ $PLATFORM = "ios" ]]
then 
  echo "Exiting because, it's iOS";
  exit 0;
fi

[[ $APPCENTER_BRANCH = "staging" || $APPCENTER_BRANCH = "main" ]] && DEVICE_SET="release" || DEVICE_SET="development"

appcenter login --password $APPCENTER_PASSWORD --user $APPCENTER_USER --quiet --version --debug

appcenter test generate appium --platform $PLATFORM --output-path $APPCENTER_SOURCE_DIRECTORY/chijioke --debug
echo "Generated Launch Test\n"

SOURCE_APK=$APPCENTER_SOURCE_DIRECTORY/android/app/build/outputs/apk/release/app-release.apk

npm install -g replace-in-file

replace-in-file "capabilities.setCapability(\"app\", \"/path/to/app.apk\");" "capabilities.setCapability(\"app\", \"$SOURCE_APK\");" $APPCENTER_SOURCE_DIRECTORY/chijioke/src/test/java/com/azure/mobile/app/test/LaunchTest.java --encoding=utf-8 --disableGlobs true

cd $APPCENTER_SOURCE_DIRECTORY/chijioke

mvn -DskipTests -P prepare-for-upload package

appcenter test run appium --app "Photizo/Rentit-Android-Production" --devices "Photizo/$DEVICE_SET-$PLATFORM" --app-path $APPCENTER_SOURCE_DIRECTORY/android/app/build/outputs/apk/release/app-release.apk --test-series "launch-tests" --locale "en_US" --build-dir $APPCENTER_SOURCE_DIRECTORY/chijioke/target/upload --token $APPCENTER_CLI_TOKEN --debug

echo "Completed Run"
