import AppiumSetup, {OS_CLI_ARG_NAME, IOS_PLATFORM_NAME} from '../helper';

let client;
let isIOS;
let visible;
beforeAll(async () => {
  client = await AppiumSetup.setup();
  if (
    AppiumSetup.getCommandLineArgument(OS_CLI_ARG_NAME).toLowerCase() ===
    IOS_PLATFORM_NAME.toLowerCase()
  ) {
    isIOS = true;
    visible = 'visible';
  } else {
    isIOS = false;
    visible = 'displayed';
  }
});

beforeEach(async () => {
  if (client) {
    await client.launchApp();
  }
});

afterAll(async () => {
  if (client) {
    // await client.deleteSession();
  }
});

test('First UI Test', async () => {
  // await client.hasElementByAccessibilityId('email')
  const stepOne = isIOS
    ? await client.$('~Step One')
    : await client.$('//android.widget.TextView[1]');
  expect(await stepOne.getAttribute(visible)).toBeTruthy();
});

// const {remote} = require('webdriverio');

// const capabilities = {
//   platformName: 'Android',
//   'appium:automationName': 'UiAutomator2',
//   'appium:deviceName': 'Android',
//   'appium:appPackage': 'com.android.settings',
//   'appium:appActivity': '.Settings',
// };

// const wdOpts = {
//   hostname: process.env.APPIUM_HOST || 'localhost',
//   port: parseInt(process.env.APPIUM_PORT, 10) || 4723,
//   path: '/wd/hub',
//   logLevel: 'info',
//   capabilities,
// };

// async function runTest() {
//   const driver = await remote(wdOpts);
//   try {
//     const batteryItem = await driver.$('//*[@text="Battery"]');
//     await batteryItem.click();
//   } finally {
//     await driver.pause(1000);
//     await driver.deleteSession();
//   }
// }

// runTest().catch(console.error);
