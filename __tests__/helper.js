import wdio from 'webdriverio';

export const JEST_IMPLICIT_TIMEOUT = 60000;
export const WD_IMPLICIT_TIMEOUT = 10000;

export const PORT = 4723;
export const HOSTNAME = 'localhost';
export const PATH = '/wd/hub';

export const ANDROID_PLATFORM_NAME = 'Android';
export const ANDROID_DEVICE_NAME = 'Android Emulator';
export const ANDROID_APP = './android/app/build/outputs/apk/release/app-release.apk';
export const ANDROID_AUTOMATION_NAME = 'UiAutomator2';

export const IOS_PLATFORM_NAME = 'iOS';
export const IOS_DEVICE_NAME = 'iPhone 11';
export const IOS_AUTOMATION_NAME = 'XCUITest';

export const OS_CLI_ARG_NAME = 'os';

export const ANDROID_CAPABILITIES = {
  hostname: HOSTNAME,
  path: PATH,
  port: PORT,
  capabilities: {
    platformName: ANDROID_PLATFORM_NAME,
    deviceName: ANDROID_DEVICE_NAME,
    app: ANDROID_APP,
    automationName: ANDROID_AUTOMATION_NAME,
  },
};

export const IOS_CAPABILITIES = {
  hostname: HOSTNAME,
  path: PATH,
  port: PORT,
  capabilities: {
    platformName: IOS_PLATFORM_NAME,
    deviceName: IOS_DEVICE_NAME,
    automationName: IOS_AUTOMATION_NAME,
  },
};

class AppiumSetup {
  static async setup() {
    jest.setTimeout(JEST_IMPLICIT_TIMEOUT);
    const client = await wdio.remote(this.getMobileCapabilities());
    client.setImplicitTimeout(WD_IMPLICIT_TIMEOUT);
    return client;
  }

  /**
   * Looks for a custom command line argument provided with the same name as 'argument'. Returns the value of the argument.
   * ex: Given command 'npm run appium-test -- --os=Android', getCommandLineArgument("os") will return 'Android'.
   */
  static getCommandLineArgument(argument) {
    let result = '';

    process.argv.forEach(element => {
      if (element.split('=')[0] === `--${argument}`) {
        [, result] = element.split('=');
      }
    });

    return result;
  }

  static getMobileCapabilities() {
    const os = this.getCommandLineArgument(OS_CLI_ARG_NAME).toLowerCase();
    return os === IOS_PLATFORM_NAME.toLowerCase() ? IOS_CAPABILITIES : ANDROID_CAPABILITIES;
  }
}

export default AppiumSetup;
