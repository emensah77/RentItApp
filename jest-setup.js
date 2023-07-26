import React from 'react';
import dotenv from 'dotenv';

global.React = React;

dotenv.config({path: '.env.test'});
window = {};
Object.defineProperty(window, 'navigator', {
  value: {
    platform: 'win32',
    product: 'v100',
    vendor: 'firefox',
    userAgent: 'chrome',
    language: 'es',
    geolocation: '',
  },
  configurable: true,
});

navigator = {}
Object.defineProperty(navigator, 'geolocation', {
  value: '',
  configurable: true,
});
console.warn = () => null;

jest.mock('react-native-gesture-handler', () => require('react-native-gesture-handler/jestSetup'));

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('react-native-permissions', () => require('react-native-permissions/mock'));

jest.mock('@react-native-community/google-signin', () => {});

jest.mock('@react-native-community/netinfo', () =>
  require('@react-native-community/netinfo/jest/netinfo-mock.js'),
);

jest.mock('@fortawesome/react-native-fontawesome', () => ({
  FontAwesomeIcon: '',
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
  ReturnCode: {isSuccess: jest.fn(), isCancelled: jest.fn()},
}));

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

jest.mock('@react-native-firebase/auth', () => () => {
  return {
    currentUser: {uid: undefined},
    signInWithCustomToken: jest.fn(),
  };
});

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
