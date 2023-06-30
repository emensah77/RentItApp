import wd from 'wd';

// Note:
// This is working as of commit `35b79a0`, run `git reflog` to view the
// commit, and see how far away things have moved from it

const PORT = 4723;
const CONFIG = {
  platformName: 'Android',
  app: './android/app/build/outputs/apk/debug/app-universal-debug.apk',
  newCommandTimeout: 0,
  'appium:deviceName': 'Android Emulator',
  'appium:automationName': 'UiAutomator2',
  'appium:noSign': true,
  'appium:noReset': true,
  'appium:printPageSourceOnFindFailure': true,
  'appium:skipDeviceInitialization': false,
  'appium:uiautomator2ServerReadTimeout': 1000000,
  'appium:dontStopAppOnReset': true,
  'appium:shouldTerminateApp': false,
  'appium:enforceAppInstall': false,
  'appium:remoteAppsCacheLimit': 1,
  'appium:skipServerInstallation': true,
  // Set this to `true` if the app installed on the device connected over adb) is NOT running
  'appium:forceAppLaunch': false,
};

const driver = wd.promiseChainRemote('localhost', PORT);
driver.on('status', function (...info) {
  console.debug('Status Update', ...info);
});

(async () => {
  await driver.init(CONFIG);

  const element1 = await driver.elementByCssSelectorIfExists('android.widget.FrameLayout');
  console.debug('1:', element1);

  const element2 = await driver.elementByClassNameIfExists('android.widget.ImageView');
  console.debug('2:', element2);

  let timestamp = new Date().getTime();
  setTimeout(async () => {
    console.debug('Continuing', new Date().getTime() - timestamp);

    timestamp = new Date().getTime();

    await driver.waitForElementByAccessibilityId(
      'welcomemessage',
      wd.asserters.isDisplayed,
      100000,
      1000,
      (...a) => console.debug('DONE:', ...a, new Date().getTime() - timestamp),
    );

    const element3 = await driver.elementByAccessibilityId('welcomemessage');
    console.debug('3:', element3);
  }, 200000);
})();
