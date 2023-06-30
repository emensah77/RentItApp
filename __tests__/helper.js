export const HOSTNAME = 'localhost';
export const PORT = 4723;
export const PATH = '/wd/hub';
export const isDebug = process.env.DEBUG === 'true';

export const CONFIG = {
  platformName: 'Android',
  app: './android/app/build/outputs/apk/debug/app-universal-debug.apk',
  newCommandTimeout: 0,
  'appium:deviceName': 'Android Emulator',
  'appium:automationName': 'UiAutomator2',
  // 'appium:noSign': true,
  // 'appium:noReset': true,
  // 'appium:printPageSourceOnFindFailure': true,
  // 'appium:skipDeviceInitialization': false,
  // 'appium:uiautomator2ServerReadTimeout': 1000000,
  // 'appium:dontStopAppOnReset': true,
  // 'appium:shouldTerminateApp': false,
  // 'appium:enforceAppInstall': false,
  // 'appium:remoteAppsCacheLimit': 1,
  // 'appium:skipServerInstallation': true,
  // Set this to `true` if the app installed on the device connected over adb is NOT running
  // 'appium:forceAppLaunch': true,
};

export const getCommandLineArgument = argument => {
  let result = '';

  process.argv.forEach(element => {
    if (element.split('=')[0] === `--${argument}`) {
      [, result] = element.split('=');
    }
  });

  return result;
};
