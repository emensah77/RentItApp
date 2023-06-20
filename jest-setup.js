// require('dotenv').config({
//   path: '.env.test',
// });
import 'react-native-gesture-handler/jestSetup';
import dotenv from 'dotenv';
// import * as MockReactNative from 'react-native';

dotenv.config({path: '.env.test'});
// Object.defineProperty(glbalThis.navigator, 'language', {value: 'es', configurable: true});

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
jest.mock('react-native-permissions', () =>
  require('react-native-permissions/mock'),
);
jest.mock('@react-native-community/google-signin', () => {});
jest.mock('@react-native-community/netinfo', () => require('@react-native-community/netinfo/jest/netinfo-mock.js'));
jest.mock('@fortawesome/react-native-fontawesome', () => ({
  FontAwesomeIcon: ''
}));
jest.mock('aws-amplify');
jest.mock('react-native-image-crop-picker', () => ({
  openCamera: jest.fn(),
}));
jest.mock('react-native-fs', () => ({
  copyFile: jest.fn(),
  CachesDirectoryPath: jest.fn(),
}));
jest.mock('ffmpeg-kit-react-native', () => ({
  FFmpegKit: {execute: jest.fn()},
  ReturnCode: {isSuccess: jest.fn(), isCancelled: jest.fn()}
}));

// jest.mock('react-native', () => {
//   // Extend ReactNative
//   return Object.setPrototypeOf(
//     {
//       // Mock a native module
//       NativeModules: {
//         ...(MockReactNative?.NativeModules || {}),
//         MixpanelReactNative: {
//           initialize: jest.fn(),
//           setServerURL: jest.fn(),
//           setLoggingEnabled: jest.fn(),
//           setFlushOnBackground: jest.fn(),
//           setUseIpAddressForGeolocation: jest.fn(),
//           hasOptedOutTracking: jest.fn(),
//           optInTracking: jest.fn(),
//           optOutTracking: jest.fn(),
//           identify: jest.fn(),
//           alias: jest.fn(),
//           track: jest.fn(),
//           trackWithGroups: jest.fn(),
//           setGroup: jest.fn(),
//           getGroup: jest.fn(),
//           addGroup: jest.fn(),
//           removeGroup: jest.fn(),
//           deleteGroup: jest.fn(),
//           registerSuperProperties: jest.fn(),
//           registerSuperPropertiesOnce: jest.fn(),
//           unregisterSuperProperty: jest.fn(),
//           getSuperProperties: jest.fn(),
//           clearSuperProperties: jest.fn(),
//           timeEvent: jest.fn(),
//           eventElapsedTime: jest.fn(),
//           reset: jest.fn(),
//           getDistinctId: jest.fn(),
//           set: jest.fn(),
//           setOnce: jest.fn(),
//           increment: jest.fn(),
//           append: jest.fn(),
//           union: jest.fn(),
//           remove: jest.fn(),
//           unset: jest.fn(),
//           trackCharge: jest.fn(),
//           clearCharges: jest.fn(),
//           deleteUser: jest.fn(),
//           groupSetProperties: jest.fn(),
//           groupSetPropertyOnce: jest.fn(),
//           groupUnsetProperty: jest.fn(),
//           groupRemovePropertyValue: jest.fn(),
//           groupUnionProperty: jest.fn(),
//         },
//       },
//     },
//     MockReactNative || {},
//   );
// });

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');
jest.mock('mixpanel-react-native', () => {
  class Mixpanel {
    identify = jest.fn();

    init = jest.fn();

    people = {
      set: jest.fn(),
    };
  }

  return {__esModule: true, Mixpanel};
});
