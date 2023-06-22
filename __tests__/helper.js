export const HOSTNAME = 'localhost';
export const PORT = 4723;
export const PATH = '/wd/hub';
export const isDebug = process.env.DEBUG === 'true';

export const CONFIG = {
  platformName: 'Android',
  deviceName: 'Android Emulator',
  automationName: 'UiAutomator2',
  newCommandTimeout: 50000,
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
