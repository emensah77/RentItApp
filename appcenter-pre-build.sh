#!/usr/bin/env bash
cd $APPCENTER_SOURCE_DIRECTORY

tree $CONFIGURATION_BUILD_DIR
ls -lSAR $CONFIGURATION_BUILD_DIR

echo "\n--------------------------------------------\nMain JSBundle"
cat /Users/runner/Library/Developer/Xcode/DerivedData/AirbnbClone-gbbroiutnhvueyfpqbsbqhpycdzy/Build/Intermediates.noindex/ArchiveIntermediates/AirbnbClone/BuildProductsPath/Release-iphoneos/main.jsbundle

echo "\n--------------------------------------------\nAirbnbClone.app:"
cat /Users/runner/Library/Developer/Xcode/DerivedData/AirbnbClone-gbbroiutnhvueyfpqbsbqhpycdzy/Build/Intermediates.noindex/ArchiveIntermediates/AirbnbClone/BuildProductsPath/Release-iphoneos/AirbnbClone.app

echo "\n--------------------------------------------\nmain.jsbundle.map:"
cat /Users/runner/Library/Developer/Xcode/DerivedData/AirbnbClone-gbbroiutnhvueyfpqbsbqhpycdzy/Build/Intermediates.noindex/ArchiveIntermediates/AirbnbClone/IntermediateBuildFilesPath/AirbnbClone.build/Release-iphoneos/AirbnbClone.build/DerivedSources/main.jsbundle.map
