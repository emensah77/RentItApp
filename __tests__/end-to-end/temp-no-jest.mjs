import wd from 'wd';

const PORT = 4723;
const isDebug = process.env.DEBUG === 'true';
const type = isDebug ? 'debug' : 'release';
const config = {
  platformName: 'Android',
  deviceName: 'Android Emulator',
  app: `./android/app/build/outputs/apk/${type}/app-${type}.apk`,
  automationName: 'UiAutomator2',
  newCommandTimeout: 50000,
};
const driver = wd.promiseChainRemote('localhost', PORT);

// Uncomment to run
(async () => {
  await driver.init(config);
  await driver.sleep(10000);

  const element1 = await driver.elementByCssSelectorIfExists('android.widget.FrameLayout');
  console.debug('1:', element1);

  await driver.resetApp();

  const element2 = await driver.elementByClassNameIfExists('android.widget.ImageView');
  console.debug('2:', element2);

  await driver.waitForElementByAccessibilityId('welcomemessagec', undefined, 100000, 1000, (...a) =>
    console.debug('DONE:', ...a),
  );
  const element3 = await driver.elementByAccessibilityId('welcomemessagec');
  console.debug('3:', element3);
})();
